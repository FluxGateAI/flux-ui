# CLAUDE.md

Context for future Claude sessions (and humans). Explains the *why* behind the
repo layout, what was extracted from where, the decisions that shaped the
library API, and where the seams are if you want to extend it.

## Current state, at a glance

- **`packages/flux-ui/`** — `@flux-ui/react`, the publishable component
  library. 29 exports, 75 vitest tests, no build step (ships TS source).
- **`packages/docs/`** — a live API playground. Every component rendered
  with a side-by-side code snippet.
- **`sample/`** — **Ember**, a fictional writing assistant. A complete
  marketing-and-demo site that exercises nearly every component in the
  library and runs entirely in the browser (no backend, no auth provider,
  no payments). Routes: `/` (landing), `/approach` (methodology),
  `/pricing` (tiers), `/try` (four-step interactive wizard), `/showcase`
  (everything else).

## Motivation

This repo started life as `sample/` — a Vite + React 19 + Tailwind v4 build of
**ResuMaker** (an AI resume builder). ResuMaker was a complete,
production-shaped app with Clerk auth, Stripe billing, SSE-driven pipelines,
drag-and-drop reordering, animated stat carousels, and a strong "warm
editorial" visual identity (Cormorant Garamond headings, amber accents,
grain overlay, ambient glow).

The user wanted to **reuse that visual language to build other sites without
copy-pasting** — components, theme, animations, layout chrome — so they could
ship a new product with `npm install` instead of `git clone + delete`.

The work happened in two phases:

### Phase 1 — Extract & generalize

1. Extract everything that's not domain-specific into a publishable component
   library (`@flux-ui/react`).
2. Generalize the parts that *were* domain-specific (the JobTargeting picker,
   the generation pipeline screen, the resume-shaped preview) into shapes that
   non-resume sites can also use.
3. Rebuild the original ResuMaker site as a thin consumer of that library to
   prove the abstraction holds — visually identical to the original, with
   dramatically less code in the sample.
4. Ship a docs/examples app so the library can be onboarded without reading
   source.

### Phase 2 — Replace the sample with a backend-free demo

Once the library was working, the ResuMaker sample wasn't pulling its weight
as a *reference for new consumers*. It needed a full backend, Clerk keys,
Stripe configuration, and a production API to run — so anyone cloning the
repo to evaluate the library couldn't actually see it in action.

The sample was therefore replaced with **Ember**, a fictional writing
assistant. Ember is designed to:

- Run with zero external dependencies (no backend, no auth provider, no
  payment processor).
- Exercise nearly every component the library exports inside a coherent
  product narrative — a marketing site plus a working demo wizard.
- Serve as the obvious template to copy when starting a new product.

The library API itself is unchanged from Phase 1 — Ember just happens to be
a much better demonstration of it than ResuMaker was.

## Repo layout

```text
flux-ui/                         # repo root, npm workspaces
├── package.json                 # workspaces: packages/*, sample
├── tsconfig.base.json           # shared compilerOptions
├── .prettierrc.json
├── .gitignore
├── README.md                    # consumer-facing entry point
├── CLAUDE.md                    # this file
│
├── packages/
│   ├── flux-ui/                 # @flux-ui/react — the publishable library
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts       # includes vitest config
│   │   ├── eslint.config.js
│   │   ├── README.md            # library API reference
│   │   ├── PUBLISHING.md        # release checklist
│   │   ├── src/
│   │   │   ├── index.ts         # public barrel — the only entry consumers touch
│   │   │   ├── lib/
│   │   │   │   ├── cn.ts        # clsx + tailwind-merge
│   │   │   │   └── format.ts    # formatRelativeTime, wordCount
│   │   │   ├── theme/
│   │   │   │   ├── theme-context.ts   # context (split off so theme-provider.tsx exports only a component — react-refresh rule)
│   │   │   │   ├── theme-provider.tsx # ThemeProvider
│   │   │   │   └── use-theme.ts       # useTheme()
│   │   │   ├── styles/
│   │   │   │   ├── index.css    # @import barrel + @source directives
│   │   │   │   ├── theme.css    # OKLCH tokens, light + dark variants, fonts
│   │   │   │   └── utilities.css # grain, glow, fade-up, card-lift, stat-*
│   │   │   └── components/
│   │   │       ├── ui/          # shadcn-style primitives (Button, Card, Input, etc.)
│   │   │       ├── site-shell.tsx       # full page chrome
│   │   │       ├── page-header.tsx
│   │   │       ├── file-dropzone.tsx
│   │   │       ├── text-input-card.tsx
│   │   │       ├── segmented-tabs.tsx
│   │   │       ├── either-or-card.tsx   # generalized JobTargeting + Callout
│   │   │       ├── stat-carousel.tsx
│   │   │       ├── pipeline-progress.tsx  # generalized GeneratingScreen
│   │   │       ├── sortable-list.tsx
│   │   │       ├── accent-color-picker.tsx
│   │   │       ├── miniature-resume-preview.tsx
│   │   │       ├── seo.tsx
│   │   │       └── require-auth.tsx     # provider-agnostic auth guard
│   │   └── tests/
│   │       ├── setup.ts         # jsdom + RTL bootstrapping
│   │       └── *.test.{ts,tsx}  # 23 files, 75 tests
│   │
│   └── docs/                    # live examples app
│       ├── package.json
│       ├── vite.config.ts
│       ├── index.html
│       └── src/
│           ├── main.tsx         # wraps in ThemeProvider + BrowserRouter
│           ├── App.tsx          # SiteShell + Route table
│           ├── styles.css       # @import '@flux-ui/react/styles.css'
│           └── pages/
│               ├── index-page.tsx
│               ├── primitives.tsx
│               ├── layout.tsx
│               ├── inputs.tsx
│               ├── data-entry.tsx
│               ├── feedback.tsx
│               ├── lists.tsx
│               ├── overlays.tsx
│               └── showcase.tsx # <Showcase> wrapper used by every page
│
├── sample/                      # Ember — a fictional writing assistant
│   ├── package.json             # depends on @flux-ui/react (workspace)
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   ├── eslint.config.js
│   ├── index.html               # title, OG meta, Google Fonts, theme bootstrap
│   ├── public/                  # logo, favicon
│   ├── scripts/                 # puppeteer screenshot tools
│   └── src/
│       ├── main.tsx             # ThemeProvider + HelmetProvider + SeoProvider + Toaster
│       ├── App.tsx              # SiteShell wired with Ember brand
│       ├── router.tsx           # five lazy routes
│       ├── index.css            # one line: @import '@flux-ui/react/styles.css'
│       └── pages/
│           ├── landing.tsx      # hero, stats, features, CTA
│           ├── approach.tsx     # methodology sections + callouts
│           ├── pricing.tsx      # three-tier cards + comparison table
│           ├── try-wizard.tsx   # 4-step interactive demo (no backend)
│           └── showcase.tsx     # all remaining components (dialog/dropdown/sortable/etc.)
│
└── scripts/
    └── screenshot.mjs           # also lives in sample/scripts (puppeteer is installed there)
```

## What was extracted, and how

> The sections below describe Phase 1 — what the original ResuMaker sample
> contained and how each piece was lifted into the library. References to
> `sample/src/components/*.tsx` describe the *post-Phase-1* ResuMaker
> wrappers (now deleted; Ember consumes the library directly).

### Theme + styles

The original [`sample/src/index.css`](./sample/src/index.css) was a single
257-line file mixing Tailwind imports, the shadcn theme, custom OKLCH tokens
for light/dark, and bespoke utilities/keyframes (`grain-overlay`,
`ambient-glow`, `hero-enter`, `card-enter-1/2/3`, `card-lift`, `signin-glow`,
`stat-value`, `stat-progress`).

It now lives in three files under `packages/flux-ui/src/styles/`:

- `theme.css` — `@theme inline` plus `:root` and `.dark` token blocks. This is
  what consumers override to retheme.
- `utilities.css` — the custom utilities + keyframes. Reserved territory
  (the original CLAUDE.md said: *"Custom global CSS classes in `index.css` are
  reserved for grain texture, ambient glow, entrance animations, and card
  hover shadow only."*).
- `index.css` — the barrel: imports Tailwind v4, the bundled `shadcn/tailwind.css`
  (keyframes + data-state variants), `tw-animate-css`, then the two files
  above. Also emits `@source` directives so Tailwind v4 picks up classes used
  inside the library's `.tsx` files even when the consumer's source tree
  doesn't reference them.

The `@source` lines were the trickiest single thing to get right — without
them, classes like `md:flex` and `sm:inline` that *only* appear inside
`SiteShell`'s source get stripped by Tailwind's content scanner, and the
consumer's navbar silently collapses to mobile mode at 1280px.

After importing `@flux-ui/react/styles.css`, the consumer's own CSS file is
a one-liner. The sample's CSS was reduced from **257 lines to 1 line**.

### shadcn primitives

The original sample shipped 4 shadcn components (`Button`, `Card`, `Textarea`,
`Accordion`) auto-generated by the shadcn CLI. The library keeps those *byte
for byte* (the visual identity depends on the exact class strings) and adds
the components a real-world app needs but ResuMaker hadn't pulled in yet:

- `Input`, `Label` — forms
- `Tabs`, `Dialog`, `DropdownMenu` — overlays
- `Separator`, `Avatar`, `Badge` — small primitives
- `Toaster` (Sonner) — toast notifications, wired to the theme tokens

All use radix-ui under the hood. `Toaster` reads `useTheme()` so its dark/light
mode follows the rest of the app.

### Visual components — moved verbatim

`SortableList` was pure dnd-kit boilerplate with no resume-specific code, so
it moved into the library unchanged.

The shadcn primitives I just listed have the same property: the styling decisions
are what matter, and those are all already in class strings.

### Visual components — generalized

These had hardcoded ResuMaker-isms that I lifted out into props:

| Original | Library export | What was extracted |
| -------- | -------------- | ------------------ |
| `site-shell.tsx` (337 LOC, FluxGate logo/links/Clerk hard-coded) | `SiteShell` | Brand becomes a config object (`{ name, href, logo, parent }`). Nav links become an array (with `to` for SPA routes vs `href` for external). The Clerk auth UI becomes an `authSlot: ReactNode` prop, so any auth provider works. Footer copyright and link list become props. Theme toggle is built in but can be hidden. `LinkComponent` defaults to plain `<a>` so the library doesn't hard-depend on react-router. |
| `file-dropzone.tsx` (with a literal LinkedIn URL footer) | `FileDropzone` | All copy (title, subtitle, placeholder, hint, accepted formats) becomes props. The LinkedIn link became a `footer?: ReactNode` slot the consumer fills in. |
| `text-input-card.tsx` (with `MAX_RESUME_CHARS` hardcoded) | `TextInputCard` | `maxChars` is a prop (default 20,000). Title/subtitle/placeholder/hint all configurable. |
| `stat-carousel.tsx` (with the resume stats hardcoded in a module-level const) | `StatCarousel` | `stats: Stat[]` is a required prop. Interval is configurable. |
| `accent-color-picker.tsx` (imported the resume `TemplatePreview` directly) | `AccentColorPicker` | The default preview is `MiniatureResumePreview`, but consumers can pass `preview={(hex) => ...}` to render anything. |
| `seo.tsx` (with `SITE_NAME`, `BASE_URL`, `DEFAULT_DESCRIPTION` as module constants) | `SeoProvider` + `SEO` | Site-wide config goes into the provider; per-page just sets title/path. |
| `require-auth.tsx` (called `useAuth` from `@clerk/react` directly) | `RequireAuth` | Provider-agnostic: takes `isLoaded`, `isSignedIn`, `redirect`. A `enabled={false}` prop bypasses entirely so the same tree works in no-auth deployments. The Clerk-specific wrapper lives in `sample/src/components/require-auth.tsx` as a 22-line file. |

### Domain components — generalized to a primitive

These three had names tied to ResuMaker but a clearly reusable shape:

| Original | Library export | Generalization |
| -------- | -------------- | -------------- |
| `JobTargeting` ("Specific Job Post" vs "Ideal Role", with the 31% callbacks callout, textarea, continue button) | `EitherOrCard` + `Callout` | Generic "pick one of N options, then describe it" primitive. The options come from a prop, including their labels, icons, placeholder text, and sub-section labels. The 31% callout is moved out into a generic `Callout` that the consumer can use anywhere. The resume-flavoured version (the "Job Post / Ideal Role" terminology, the trending-up icon, the callback statistic) lives as a 104-line wrapper at `sample/src/components/job-targeting.tsx`. |
| `GeneratingScreen` (with hardcoded "Extracting profile / Analyzing fit / Finding missed keywords" stages) | `PipelineProgress` | `stages` becomes a prop. Each stage has a `key`, `icon`, `title`, and optional `description`. The `currentStepKey` prop identifies the most recently completed stage; the next renders as "active". The hero copy (running title/subtitle, done title/subtitle) is also configurable, so a database migration UI or an order-fulfillment UI uses the same component. |
| `TemplatePreview` (a hardcoded John Doe resume mock) | `MiniatureResumePreview` | The default content is the same John Doe sample (it works as-is as a generic "document preview" visual), but `data: MiniatureResumeData` lets consumers pass their own. The accent color is a prop. |

### New primitives I added

These weren't in the original sample but were obvious gaps:

- `PageHeader` — every marketing page in the original was hand-rolling a
  `<h1>` + decorative rule + tagline pattern. Now it's one component, with
  two sizes (`md` for per-page heroes, `lg` for landing-page heroes).
- `SegmentedTabs` — the pill-style switcher was duplicated between
  `home.tsx` and `job-targeting.tsx`. Now it's a primitive with the
  "soft de-emphasis" (deemphasized: true) and "data dot" (hasData: true)
  states pre-baked, plus aria roles done right.
- `Callout` — the tinted bordered banner was inlined into JobTargeting,
  the approach page, the generate-resume questions UI, and a couple of
  error states. Now it's `<Callout tone="primary | destructive | muted">`.

### The barrel

`packages/flux-ui/src/index.ts` is the entire public API. Anything not
re-exported there is private. The barrel is the contract — when bumping
versions, the diff of this file tells you whether you're doing a minor or a
major.

## Architecture decisions

### 1. Publish source, not a build

`package.json` has no `"build"` step; it ships `.tsx` files directly via the
`exports` map pointing at `./src/index.ts`. Why:

- Consumers always use a TypeScript/JSX-aware bundler (Vite, Next.js, Remix,
  Astro). They'll re-compile anyway.
- It keeps the install size small.
- HMR Just Works™ during local development because the workspace symlink
  resolves to the source, not a bundle.
- Source maps are free.
- Versioning is honest about what changed — there's no chance of a build
  step quietly altering output.

Trade-off: we can't ship to consumers stuck on CommonJS-only stacks or those
who can't compile `.tsx`. That's a non-target.

### 2. Tailwind v4 CSS-first config

The original sample used `@tailwindcss/vite` with no `tailwind.config.js`.
The library follows the same pattern — the design tokens are CSS custom
properties (`--primary`, `--background`, `--radius`, etc.) declared in
`theme.css`, and Tailwind v4's `@theme inline` block maps them to `--color-*`
utility variables.

This is why retheming is one CSS override away (`:root { --primary: oklch(...) }`).

### 3. No global state in the library

`ThemeProvider` is the only React context the library ships, and it's
opt-in. `SiteShell` reads from `useTheme()` to wire the toggle, but renders
fine without a provider (it just won't have an active toggle). No
QueryClient, no router context, no Clerk dependency.

### 4. Provider-agnostic auth

`RequireAuth` takes `isLoaded`, `isSignedIn`, and a `redirect` callback. The
library doesn't import Clerk, NextAuth, Auth0, or anything else. Plug in any
auth provider with a ~20-line wrapper that maps its hook shape onto these
three values.

Same pattern for the navbar's auth slot — `SiteShell` accepts an
`authSlot?: ReactNode`. The auth-provider-specific UI (e.g. Clerk's
`UserButton` + `SignInButton`, or a custom modal trigger) lives in the
consumer, not the library. Ember illustrates the simplest case: the
authSlot just renders a "Try Ember" CTA `Button`, no auth flow at all.

### 5. `LinkComponent` instead of a hard react-router dep

`SiteShell` accepts a `LinkComponent` prop that defaults to plain `<a>`.
React-router-dom is listed as an *optional* peer dep. Consumers using
react-router pass `({ to, ...rest }) => <Link to={to} {...rest} />`;
consumers using Next.js pass their `next/link`; consumers building a static
HTML page can skip the prop entirely.

### 6. Tests run against source, not a build

Vitest + RTL + jsdom. Setup file mocks `matchMedia` and `ResizeObserver` (radix
needs them). 75 tests across 23 files cover every exported component plus the
two lib utilities. The full suite runs in ~2.5 seconds.

The test files use the `@/*` path alias internally (configured in
`packages/flux-ui/tsconfig.json` + `vite.config.ts`), which doesn't leak to
consumers because the library's *source* files use relative imports.

### 7. Relative imports inside the library, `@/*` aliases inside consumers

When the library used `@/lib/cn` aliases internally, consumers' `tsc` couldn't
resolve them because the alias only existed in the library's tsconfig.
Switched to relative imports (`../../lib/cn`) throughout the library source.
Consumers still use `@/*` in their own code — it just stops at the package
boundary.

### 8. Domain wrappers stay in the consumer

A clean test of the abstraction is "how much non-trivial component code does
the consumer still write?" For Ember, the answer is **zero domain wrappers** —
every component is consumed directly from `@flux-ui/react`, with brand and
content injected as props.

The Phase 1 ResuMaker rewrite was a slightly harder test: it kept three thin
wrappers in `sample/src/components/` (Clerk auth slot, a JobTargeting-flavoured
wrapper around `EitherOrCard`, and a Clerk-aware `RequireAuth`), totalling
~212 lines. Both are valid patterns — Ember demonstrates the all-props path,
ResuMaker (now deleted) demonstrated the thin-wrapper path.

## Numbers

The original ResuMaker sample (Phase 1 starting point):

```text
sample/src/components/        — 12 files
sample/src/components/ui/     — 4 files
sample/src/index.css          — 257 lines
sample/src/lib/utils.ts       — 28 lines (cn + formatRelativeTime)

Total components+styles in sample:  ~2,143 lines (all moved to the library)
```

After Phase 1 (library extracted, ResuMaker rewired to consume it):

```text
@flux-ui/react source:         ~2,911 lines (29 exports, ~1,800 new — covers
                                more components than the original sample had,
                                because we added the missing primitives)
@flux-ui/react tests:          23 files, 75 tests, all passing

sample/src/components/         — 3 wrapper files, 212 lines (ResuMaker era)
sample/src/index.css           — 1 line
```

After Phase 2 (sample replaced with Ember):

```text
sample/src/                    — 9 files total, ~970 lines
  main.tsx                       — 22 lines (provider stack)
  App.tsx                        — 49 lines (SiteShell wiring)
  router.tsx                     — 18 lines
  index.css                      — 1 line
  pages/landing.tsx              — 109 lines
  pages/approach.tsx             — 115 lines
  pages/pricing.tsx              — 169 lines
  pages/try-wizard.tsx           — 460 lines (the interactive demo)
  pages/showcase.tsx             — 270 lines

sample/src/components/          — empty (Ember uses every component via props,
                                  no domain wrappers needed)
```

The Ember sample is bigger than the post-Phase-1 ResuMaker thin layer would
have been (~250 lines of wrappers + maybe 600 lines of pages, vs. Ember's
~970), but it does dramatically more: a full marketing site plus a working
four-step interactive wizard. The point isn't to minimize the sample —
it's to demonstrate what's possible without a backend.

## Verification

`npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` all pass
from the repo root. Additionally:

- Puppeteer renders `/`, `/approach`, `/pricing`, `/try`, `/showcase` of the
  Ember sample and confirms every route renders the warm-editorial design
  with no console errors.
- The docs app at `npm run dev:docs` renders every component live with code
  snippets — try clicking through the seven section pages.

## Where the seams are

If you want to extend, here's where to start:

- **New shadcn primitive**: add to `packages/flux-ui/src/components/ui/`,
  test under `packages/flux-ui/tests/`, export from `src/index.ts`. Add a
  showcase to `packages/docs/src/pages/primitives.tsx` (or its own page if
  it's an overlay).
- **New theme token**: add to both light (`:root`) and dark (`.dark`) blocks
  in `theme.css`. If it's a color, register it under `@theme inline` so
  Tailwind generates `bg-{name}` / `text-{name}` / etc.
- **New custom utility / animation**: add to `utilities.css`. Use `@utility`
  for Tailwind-v4-style declarations (these participate in JIT class
  generation); use plain `.class { ... }` for static utilities.
- **New domain wrapper in the sample**: Ember consumes every component
  directly without wrappers. If you grow the sample into something that
  needs a domain-flavoured component (e.g. an "EitherOrCard" with
  product-specific copy and a callout), put it in `sample/src/components/`
  as a thin wrapper that injects props into the library primitive.
- **New page in the docs app**: add a page file under
  `packages/docs/src/pages/`, route it in `App.tsx`, and add a card to
  `index-page.tsx`. Use the `<Showcase>` helper for consistency.

## Known limitations

- **No automated visual regression**. The puppeteer script in
  `scripts/screenshot.mjs` produces screenshots but doesn't diff them
  against a baseline. A real release process should pin a baseline and
  diff in CI (e.g. Playwright + `expect(page).toHaveScreenshot()`).
- **No Tailwind preset export**. Consumers do retheming via CSS overrides,
  which works but doesn't surface the design tokens as JS values for use
  in non-CSS contexts (e.g. SVG `fill` props). Future improvement: export
  a `tokens.ts` with the OKLCH strings.
- **`shadcn` package is a runtime dependency** (not devDep) because the
  library's CSS does `@import 'shadcn/tailwind.css'`. That's the shadcn
  CLI package, which ships a small CSS file with keyframes and data-state
  variants. It's ~50KB on disk; fine for now, but a future improvement
  would be to inline that CSS into the library's own `utilities.css` to
  shed the dependency.
- **The Ember sample's pricing tiers don't actually charge anyone.** That's
  deliberate — keeping the sample backend-free was the whole point of
  Phase 2. If you fork the sample into a real product, replace the pricing
  buttons with real billing integration (Stripe Checkout, Lemon Squeezy,
  Paddle, etc.).
- **The wizard's pipeline runs on `setTimeout` timers.** Real backends will
  drive `currentStepKey` via SSE or polling. The pattern in
  `try-wizard.tsx` (a `GeneratingStep` component that schedules timeouts
  and calls `setStepIdx`) is meant to be replaced wholesale by a real
  data source — `PipelineProgress`'s prop API doesn't change.

## How to onboard a new site

Two paths, depending on how much you want to copy.

**Fastest** — fork the Ember sample directly:

1. Copy `sample/` to your new repo.
2. Rename `brand.name` in `App.tsx`, update the title/OG in `index.html`,
   and replace the favicon and `logo.png` in `public/`.
3. Edit the five pages to fit your product. Each one is a self-contained
   example of a common page shape — landing hero, methodology, pricing
   tiers, wizard, component showcase.

**From scratch** — start clean:

1. `npm create vite@latest my-site -- --template react-ts`
2. `npm install @flux-ui/react react-router-dom @tailwindcss/vite tailwindcss tw-animate-css react-helmet-async`
3. Add `@tailwindcss/vite` to `vite.config.ts`.
4. Replace `src/index.css` with `@import '@flux-ui/react/styles.css';`.
5. Wrap `<App />` in `<ThemeProvider>`, `<HelmetProvider>`, and `<SeoProvider>`.
6. Replace your `App.tsx` body with `<SiteShell brand={{ name: '...' }}>...`.
7. Build pages using `<PageHeader>`, `<Button>`, `<Card>`, `<EitherOrCard>`,
   `<StatCarousel>`, etc. Most marketing/dashboard sites need ~5 of these.

A site like Ember's landing + approach + pricing pages is ~400 lines of
consumer code. Add a wizard à la `/try` and you're at ~850; the rest is
business logic specific to your product.

## How to debug the library when consumed

When something looks off in the sample but the library tests pass, the most
common culprit is **Tailwind's content scanner missing classes**. Confirm
with:

```bash
# After building the sample, inspect the final CSS:
ls -la sample/dist/assets/*.css
# Then grep for a specific class you expected to see (e.g. md:flex):
grep -o "md:flex" sample/dist/assets/*.css | head
```

If the class isn't there, add an `@source` line to either the library's
`styles/index.css` or the consumer's CSS pointing at the file that uses it.

The second most common issue is **theme tokens leaking through unexpectedly**.
The library defines `--primary` etc. in `theme.css`; if a consumer's earlier
CSS file *also* defines `--primary`, ordering matters. The library should
load *first*; the consumer's overrides last.

## Future work

In rough priority order:

1. **Inline `shadcn/tailwind.css` content into our `utilities.css`** to drop
   the `shadcn` runtime dep.
2. **Export design tokens as JS** (`@flux-ui/react/tokens`) so consumers can
   read `tokens.primary` for SVG/non-CSS contexts.
3. **Add visual regression in CI** — Playwright + baseline screenshots.
4. **Add a Form primitive** wrapping react-hook-form + zod, since most
   real apps need it and re-implementing the styling is tedious.
5. **Add a DataTable primitive** for admin-flavoured sites.
6. **Add a `cli` package** with a `npx @flux-ui/cli init` command that
   scaffolds a new app with the right Vite + Tailwind + provider wiring.
7. **Split internal vs external `NavLink` types in `SiteShell`** so TS
   catches `{ to: '/x', href: 'https://...' }` (both set) at compile time.
