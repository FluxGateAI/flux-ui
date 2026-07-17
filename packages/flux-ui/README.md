# @flux-ui/react

Warm-editorial React components for Tailwind v4 apps. Opinionated about
typography, color, and motion; flexible about brand, navigation, and auth.
See the [`sample/`](../../sample) directory for a complete consumer (Ember,
a no-backend demo site).

- 29 exports across primitives, layout, inputs, feedback, lists, overlays
- shadcn-style component code (you own the styling decisions in your tree)
- radix-ui under the hood for accessibility
- Tailwind v4 CSS-first theme tokens — fully overridable
- Light/dark mode built in, with persisted user choice
- Drag-and-drop, file dropzone, segmented switcher, animated stat carousel,
  SSE-friendly pipeline progress — all batteries-included

## Install

```bash
npm install @flux-ui/react react react-dom
# optional, if you use SiteShell with internal route links:
npm install react-router-dom
```

Then import the stylesheet once at your app's CSS entry point:

```css
/* src/index.css */
@import '@flux-ui/react/styles.css';
```

This pulls in Tailwind v4, the `shadcn/tailwind.css` keyframes/variants, the
`tw-animate-css` helpers, the warm-editorial theme tokens, and the custom
utilities (`grain-overlay`, `ambient-glow`, `hero-enter`, `card-lift`,
`stat-value`, etc.).

If your app uses Vite with `@tailwindcss/vite`, you're done. If you need
finer-grained imports:

```css
@import '@flux-ui/react/theme.css';      /* tokens + base layer only */
@import '@flux-ui/react/utilities.css';  /* custom utilities + keyframes */
```

## Theming

Wrap your app in `ThemeProvider`. The provider mounts the `.dark` class on
`<html>`, persists the user choice to a cookie, and respects the
`prefers-color-scheme` media query when `theme === 'system'`.

```tsx
import { ThemeProvider } from '@flux-ui/react'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark">
    <App />
  </ThemeProvider>,
)
```

| Prop | Default | Notes |
| ---- | ------- | ----- |
| `defaultTheme` | `'dark'` | Used when nothing is persisted yet. |
| `cookieName` | `'flux-theme'` | Where the choice is read from and written to. Don't override it if you share a theme between properties — the name has to match on all of them. |
| `cookieDomain` | — | Set to a parent domain (e.g. `.fluxgate.ai`) to share across subdomains. Omit for a host-only cookie. |
| `storageKey` | `'theme'` | localStorage mirror. Read once to migrate pre-cookie users, and written on every change so the `storage` event can sync other tabs — cookies fire no such event. |

### Sharing one theme across subdomains

localStorage is origin-scoped, so a choice made on `fluxgate.ai` doesn't reach
`internal.fluxgate.ai`. A cookie scoped to the parent domain does. Pass
`cookieDomain` on every property under that domain:

```tsx
<ThemeProvider cookieDomain=".fluxgate.ai">
  <App />
</ThemeProvider>
```

Now `fluxgate.ai`, `internal.fluxgate.ai`, and `docs.fluxgate.ai` share one
choice. Two caveats:

- **The domain is never inferred.** Deriving a registrable domain from
  `location.hostname` needs the Public Suffix List — a "last two labels"
  guess breaks on `foo.co.uk`. So you pass it explicitly, and you omit it in
  environments where it doesn't apply (localhost, preview deploys), where it
  falls back to a host-only cookie.
- **Cookies can't cross a registrable domain.** Sharing with a property on a
  different eTLD+1 needs a URL-param handoff; this API won't do it.

### Preventing a flash of the wrong theme

The `.dark` class is applied from an effect — i.e. after first paint — so
without a blocking `<head>` script every load flashes the wrong scheme.
`THEME_BOOTSTRAP_SCRIPT` is the canonical script body: it reads the cookie
(falling back to localStorage for not-yet-migrated users, then `'dark'`) and
resolves `'system'` through `matchMedia` before React mounts.

It **cannot be imported** into your `index.html` — it has to run before the
bundle loads, so paste the body inline:

```html
<script>
  ;(function () {
    var m = document.cookie.match(/(?:^|;\s*)flux-theme=([^;]*)/)
    var t = m ? decodeURIComponent(m[1]) : null
    if (t !== 'light' && t !== 'dark' && t !== 'system') {
      try {
        t = localStorage.getItem('theme')
      } catch (e) {
        t = null
      }
    }
    if (t !== 'light' && t !== 'dark' && t !== 'system') t = 'dark'
    var dark = t === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches : t === 'dark'
    if (dark) document.documentElement.classList.add('dark')
  })()
</script>
```

The export exists so there's one copy to paste from and to assert against in
tests — see `tests/theme-storage.test.ts`, which fails if `sample/index.html`
or `packages/docs/index.html` drifts from it. Reading needs no domain (cookies
are sent to subdomains by name), so the same snippet works on every property.

Want a different palette? Override the OKLCH custom properties after importing
the library stylesheet:

```css
@import '@flux-ui/react/styles.css';

:root {
  --primary: oklch(0.6 0.18 250);   /* cooler blue accent */
  --ring: var(--primary);
}
```

## API reference

Every component is rendered live with an editable code sample in the docs app
(`npm run dev:docs`). The quick reference below covers the public surface.

### Primitives

| Component | Notes |
| --------- | ----- |
| `Button` | 6 variants (`default`, `secondary`, `outline`, `ghost`, `destructive`, `link`) × 7 sizes. `asChild` slot for polymorphism. |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction` | Container + sub-slots with `data-slot` attributes for styling hooks. |
| `Input`, `Textarea`, `Label` | Form primitives wired to the theme's `--input` and `--ring` tokens. |
| `Badge` | 4 variants. Supports `asChild`. |
| `Avatar`, `AvatarImage`, `AvatarFallback` | radix-ui Avatar with sensible defaults. |
| `Separator` | Horizontal/vertical, decorative or semantic. |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | radix-ui Accordion with chevron rotation + slide animations. |

### Layout

| Component | Notes |
| --------- | ----- |
| `SiteShell` | Full page chrome: grain overlay, ambient glow, nav, mobile drawer, footer. Brand, nav links, footer links, auth slot, theme toggle all configurable. Pass `LinkComponent` (e.g. react-router's `Link`) for internal routing. |
| `PageHeader` | Display heading + decorative rule + subtitle. `size: 'md' \| 'lg'`. |
| `ThemeToggle` | Pre-styled toggle button. Pairs with `ThemeProvider`. |
| `ThemeProvider`, `useTheme` | Light/dark/system state persisted to a cookie. Set `cookieDomain` to share across subdomains. |
| `THEME_BOOTSTRAP_SCRIPT` | FOUC-prevention script body to paste inline into `<head>`. See [Theming](#theming). |

### SEO

| Component | Notes |
| --------- | ----- |
| `SeoProvider` | Provide site-wide config (`siteName`, `baseUrl`, `defaultDescription`, `defaultImage`). |
| `SEO` | Per-page meta (title, description, canonical, OG, Twitter card). Requires a `HelmetProvider` ancestor. |

### Auth

| Component | Notes |
| --------- | ----- |
| `RequireAuth` | Provider-agnostic guard. Pass `isLoaded`, `isSignedIn`, and a `redirect` callback. Use `enabled={false}` to bypass entirely in no-auth deployments. |

### Inputs

| Component | Notes |
| --------- | ----- |
| `FileDropzone` | Drag-and-drop file upload (react-dropzone). All copy + accepted formats configurable. |
| `TextInputCard` | Long-form text card with word/char counter and limit warning. |
| `SegmentedTabs` | Pill-style switcher with optional "data dot" indicators and a soft-deemphasis state. |
| `EitherOrCard` | Multi-option picker + textarea + continue button — the generic wizard step shape used in Ember's `/try` audience picker. |
| `Callout` | Tinted bordered banner (`primary`, `destructive`, `muted`). |

### Feedback

| Component | Notes |
| --------- | ----- |
| `StatCarousel` | Auto-rotating stat slides with gradient-shimmer numerals. Pass your own `Stat[]`. |
| `PipelineProgress` | Animated stage list driven by `currentStepKey` events; fires `onComplete` after `holdMs` once `done` becomes true. |

### Lists & pickers

| Component | Notes |
| --------- | ----- |
| `SortableList` | Generic `@dnd-kit` wrapper. Render prop receives `handleProps` to spread on the drag handle. |
| `AccentColorPicker` | Color swatches above a live preview thumbnail. Pass `preview` to override the default `MiniatureResumePreview`. |
| `MiniatureResumePreview` | Scaled-down resume mock with dynamic accent color. Useful as a generic "document preview" visual. |

### Overlays

| Component | Notes |
| --------- | ----- |
| `Dialog` + subcomponents | radix-ui Dialog with built-in close button and focus management. |
| `DropdownMenu` + subcomponents | radix-ui DropdownMenu with items, checkbox/radio items, sub-menus, separators, shortcuts. |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | radix-ui Tabs. |
| `Toaster` | Sonner toaster pre-wired to the theme tokens. |

### Utilities

| Export | Notes |
| ------ | ----- |
| `cn(...inputs)` | `clsx` + `tailwind-merge`. The standard shadcn helper. |
| `formatRelativeTime(iso)` | "just now" / "5m ago" / "Mar 14, 2025" formatting. |
| `wordCount(text)` | Whitespace-delimited token count, returns 0 for empty input. |

## Configuring SiteShell

`SiteShell` is the most configurable component — it provides the entire page
chrome. Minimum viable usage:

```tsx
<SiteShell brand={{ name: 'Acme' }}>
  <main>page content</main>
</SiteShell>
```

The full prop surface:

```tsx
<SiteShell
  brand={{
    name: 'Ember',                                       // primary product name
    href: '/',                                           // brand link target
    logo: '/logo.png',                                   // optional 40px logo
    parent: {                                            // optional parent/umbrella brand
      name: 'Acme',
      href: 'https://acme.example',
    },
  }}
  navLinks={[
    { label: 'Approach', to: '/approach' },              // internal route
    { label: 'Docs', href: 'https://docs.example' },     // external
  ]}
  LinkComponent={({ to, ...rest }) => <Link to={to} {...rest} />}
  authSlot={<MyAuthButton />}                            // optional: auth UI on the right
  footerCopyright={<span>© Acme Inc.</span>}             // optional: custom copy
  footerLinks={[{ label: 'Privacy', href: '/privacy' }]}
  hideThemeToggle={false}
  hideGrain={false}
  hideAmbientGlow={false}
>
  <Outlet />
</SiteShell>
```

If you don't pass `LinkComponent`, internal `to` paths render as plain `<a>`
elements — useful for non-SPA sites.

## Working with the Tailwind v4 content scanner

The library's CSS includes `@source` directives so that Tailwind picks up class
names from `@flux-ui/react/src/components/**`. If you import the library from a
monorepo or other layout where this scan can't find the files, add an explicit
source in your own CSS:

```css
@import '@flux-ui/react/styles.css';
@source "../node_modules/@flux-ui/react/src/**/*.{ts,tsx}";
```

## Peer dependencies

| Peer | Required | Notes |
| ---- | -------- | ----- |
| `react` ^18 \|\| ^19 | yes | — |
| `react-dom` ^18 \|\| ^19 | yes | — |
| `react-router-dom` ^6 \|\| ^7 | optional | Only used by `SiteShell`'s `LinkComponent` prop and `RequireAuth`'s redirect callback. |

## Running locally

```bash
npm install                # at the monorepo root
npm run dev --workspace=@flux-ui/react      # vite dev server (mostly for HMR while writing tests)
npm run test --workspace=@flux-ui/react     # vitest run
npm run typecheck --workspace=@flux-ui/react
npm run lint --workspace=@flux-ui/react
```

The docs app at `packages/docs` shows every component live. Run with
`npm run dev:docs` from the root.

## Publishing

See [`PUBLISHING.md`](./PUBLISHING.md) for the release checklist.

## License

MIT
