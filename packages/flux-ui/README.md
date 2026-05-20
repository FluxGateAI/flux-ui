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
`<html>`, persists the user choice to `localStorage`, and respects the
`prefers-color-scheme` media query when `theme === 'system'`.

```tsx
import { ThemeProvider } from '@flux-ui/react'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="theme">
    <App />
  </ThemeProvider>,
)
```

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
| `ThemeProvider`, `useTheme` | Light/dark/system state with `localStorage` persistence. |

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
