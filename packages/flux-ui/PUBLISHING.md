# Publishing @flux-ui/react

This package publishes its source `.ts`/`.tsx` files directly — there's no
build step. Consumers compile them through their own bundler (Vite, Next.js,
etc.), which keeps the install fast, the bundle tree-shakable, and source
maps automatic. The trade-off is that consumers need a TypeScript/JSX-aware
bundler, which is true of every modern React app stack we target.

## One-time setup

1. **npm account with `@flux-ui` scope access.**

   If `@flux-ui` is your personal scope:

   ```bash
   npm login
   # the package.json already has `"name": "@flux-ui/react"`
   ```

   If you want to publish under your own scope instead, edit
   [`package.json`](./package.json) and change `"name"` (e.g. `@your-org/react`),
   and update the matching dependency in [`/sample/package.json`](../../sample/package.json)
   and [`/packages/docs/package.json`](../docs/package.json).

2. **Verify publish access.**

   ```bash
   npm access list packages @flux-ui
   ```

   For a brand-new scope on the free tier, add `--access public` to the first
   `npm publish` (see below).

3. **Decide on a versioning strategy.** This repo uses plain `npm version` —
   no Changesets / no Lerna. Each release is a single `git tag` on `main`.

## Release checklist

Run from **the library directory**, not the repo root, so `npm` resolves
`./package.json` correctly:

```bash
cd packages/flux-ui
```

Then:

1. **Make sure your working tree is clean.**

   ```bash
   git status        # should report "nothing to commit"
   ```

2. **Run the full verification pass.** Everything must pass before publishing.

   ```bash
   # From the repo root:
   npm install                    # ensure lockfile is current
   npm run typecheck              # tsc across all workspaces
   npm run lint                   # eslint library + sample
   npm run test                   # 95 vitest tests in the library
   npm run build                  # docs SPA + sample SPA both compile
   ```

3. **Smoke-test the consumer.** Boot the sample against the in-repo workspace
   copy of the library and visually confirm nothing regressed.

   ```bash
   npm run dev:sample             # http://localhost:3000
   # OR for a screenshot pass:
   (cd sample && npx vite preview) &
   node scripts/screenshot.mjs http://127.0.0.1:4173 /tmp/flux-ui-screens
   ```

4. **Bump the version.** Pick `patch`, `minor`, or `major` per semver:

   ```bash
   npm version patch              # 0.1.0 → 0.1.1
   npm version minor              # 0.1.0 → 0.2.0
   npm version major              # 0.1.0 → 1.0.0
   ```

   This rewrites `package.json`, creates a git commit, and tags it as
   `v<version>`. Push both:

   ```bash
   git push --follow-tags
   ```

5. **Verify the package contents before shipping.** `npm pack` produces the
   tarball that will be uploaded. Inspect it:

   ```bash
   npm pack --dry-run
   ```

   Confirm the file list includes `src/`, `README.md`, and `package.json`
   only. Anything in `node_modules`, `tests/`, `dist/`, or temp files is a
   bug in the `files` field of `package.json`.

6. **Publish.**

   For a brand-new scoped package on the free tier:

   ```bash
   npm publish --access public
   ```

   For subsequent releases:

   ```bash
   npm publish
   ```

7. **Verify on the registry.**

   ```bash
   npm view @flux-ui/react versions
   npm view @flux-ui/react dist-tags
   ```

   And, in a throwaway directory:

   ```bash
   mkdir /tmp/flux-ui-install-test && cd /tmp/flux-ui-install-test
   npm init -y
   npm install @flux-ui/react react react-dom
   ls node_modules/@flux-ui/react/src   # expect components/, theme/, lib/, styles/
   ```

## Versioning policy

- **Patch (`0.1.x`)** — bug fixes, doc-only changes, internal refactors that
  don't change public types or rendered DOM.
- **Minor (`0.x.0`)** — new components, new optional props, additive theme
  tokens, new exports. Behavioural defaults stay the same.
- **Major (`x.0.0`)** — breaking prop/export renames, theme token removals,
  CSS variable renames, peer-dep range bumps that drop a major React/Tailwind
  version, anything that requires the consumer to touch their code or styles.

While we're on `0.x` everything is technically "minor" per semver, but treat
prop renames as majors anyway so consumers can rely on cleanly bumping a
minor.

### Worked example: 0.2.0 — theme persistence moves to a cookie

A useful precedent for classifying a change whose *behaviour* moves but whose
*API* only grows. `ThemeProvider` switched from persisting to `localStorage`
to persisting to a `flux-theme` cookie, so one theme choice can follow a user
across `*.fluxgate.ai` subdomains.

**Minor**, not major, because:

- The public surface only *gains* optional props (`cookieName`,
  `cookieDomain`) and one new export (`THEME_BOOTSTRAP_SCRIPT`). Nothing was
  renamed or removed; `storageKey` still works.
- The default is a **host-only** cookie, so a consumer who changes nothing
  gets the same single-origin behaviour they had.
- Existing users don't lose their choice — the provider reads the old
  localStorage value once and migrates it to the cookie.

Call out in the release notes:

- **Storage moved from `localStorage` to the `flux-theme` cookie.** Migration
  is automatic and one-time; no consumer action is needed. Anything that read
  `localStorage.getItem('theme')` directly should read the cookie instead —
  localStorage is still written, but only as a mirror to drive cross-tab
  `storage` events, and it is no longer the source of truth.
- **To share a theme across subdomains**, pass `cookieDomain=".example.com"`
  on every property. The domain is deliberately not inferred; omit it for
  host-only.
- **Update your inline FOUC script** to the current
  `THEME_BOOTSTRAP_SCRIPT` body (see the README). The old snippet reads
  localStorage and mishandles `'system'`. Consumers who skip this keep
  working, but users who picked `'system'` on a dark-mode OS will flash light
  on load, and a choice made on another subdomain won't apply until React
  mounts.
- **Cookie caveat**: the theme is now sent on every request to the domain.
  That's ~16 bytes, and it means a CDN caching HTML by URL alone can serve a
  page with the wrong bootstrap class — vary on the cookie if you pre-render.

## What ships in the tarball

The `files` field in `package.json` pins this down. As of v0.1.0:

```text
@flux-ui/react/
├── package.json
├── README.md
└── src/
    ├── index.ts           # public barrel
    ├── components/        # all .tsx components
    │   └── ui/            # shadcn primitives
    ├── theme/             # ThemeProvider, useTheme, ThemeContext
    ├── styles/            # styles/index.css + theme.css + utilities.css
    └── lib/               # cn(), format helpers
```

The package's `exports` map (in `package.json`) exposes:

- `.` — TypeScript source (`./src/index.ts`)
- `./styles.css` — the bundled stylesheet entry point
- `./theme.css` — just the design tokens
- `./utilities.css` — just the custom utilities + keyframes

Consumers using ESM-aware bundlers will resolve the right file automatically.

## Pre-release tagging

To publish a beta without overwriting the `latest` tag:

```bash
npm version 0.2.0-beta.0
npm publish --tag beta
```

Consumers opt in with `npm install @flux-ui/react@beta`.

## Unpublishing

If you publish a broken version, the safe move is to immediately publish a
fixed patch, not to `npm unpublish` (which is restricted and disruptive).
If you absolutely must, you have a 72-hour window for unscoped packages and
24 hours for scoped — see [the npm docs](https://docs.npmjs.com/policies/unpublish).

## Rotating npm credentials

If you publish from a CI job:

1. Generate an **automation token** at <https://www.npmjs.com/settings/~/tokens>.
2. Store it as the `NPM_TOKEN` repository secret.
3. In CI, write the token to `~/.npmrc` before publishing:

   ```bash
   echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc
   ```

4. Never commit `.npmrc` with a token; it's covered by the repo's
   [`.gitignore`](../../.gitignore).
