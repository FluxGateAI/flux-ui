# flux-ui

A warm-editorial React + Tailwind v4 component library. Build identical-looking
sites with a fraction of the frontend code.

The included [`sample/`](./sample) is **Ember**, a fictional writing assistant
that shows the library in action — a marketing site (`/`, `/approach`,
`/pricing`), a fully interactive demo wizard (`/try`), and a component showcase
(`/showcase`). It runs entirely in the browser, no backend required.

## What's in this repo

```text
flux-ui/
├── packages/
│   ├── flux-ui/        # @flux-ui/react — the publishable component library
│   └── docs/           # Live API docs (every component with code snippets)
├── sample/             # Ember — a no-backend demo site consuming @flux-ui/react
├── scripts/
│   └── screenshot.mjs  # Headless puppeteer screenshots of the sample
├── package.json        # npm workspaces root
├── tsconfig.base.json
└── CLAUDE.md           # Context, motivation, architecture decisions
```

This is an **npm workspaces** monorepo. From the repo root:

```bash
npm install            # install deps for all three packages
npm run test           # run the library's vitest suite (75 tests)
npm run dev:docs       # http://localhost:3100 — live API playground
npm run dev:sample     # http://localhost:3000 — Ember (the demo site)
npm run typecheck      # tsc across all workspaces
npm run lint           # eslint library + sample
npm run build          # production builds (library types, docs SPA, sample SPA)
```

## Quick taste

A site that ships the full warm-editorial chrome — grain overlay, ambient glow,
dark/light toggle, fade-up entrance animations, Cormorant Garamond display
font — needs about this much code:

```tsx
// main.tsx
import { ThemeProvider, SeoProvider } from '@flux-ui/react'
import '@flux-ui/react/styles.css'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <SeoProvider siteName="Acme" baseUrl="https://acme.test">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SeoProvider>
  </ThemeProvider>,
)

// App.tsx
import { SiteShell } from '@flux-ui/react'
import { Link, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <SiteShell
      brand={{ name: 'Acme', href: '/' }}
      navLinks={[{ label: 'Docs', to: '/docs' }, { label: 'Pricing', to: '/pricing' }]}
      LinkComponent={({ to, ...rest }) => <Link to={to} {...rest} />}
      footerLinks={[{ label: 'GitHub', href: 'https://github.com' }]}
    >
      <Outlet />
    </SiteShell>
  )
}
```

That's the whole shell. See [`packages/flux-ui/README.md`](./packages/flux-ui/README.md)
for the full component reference and [`sample/`](./sample) for a complete
working configuration (landing page, pricing tiers, interactive wizard,
showcase).

## What Ember demonstrates

The five routes in the sample exercise nearly every component the library
ships:

| Route | Library components used |
| ----- | ----------------------- |
| `/` | `PageHeader`, `Button`, `StatCarousel`, `Card`, `SEO` |
| `/approach` | `PageHeader`, `Callout`, `Button` |
| `/pricing` | `PageHeader`, `Card`, `Badge`, `Button` |
| `/try` | `SegmentedTabs`, `FileDropzone`, `TextInputCard`, `EitherOrCard`, `Callout`, `AccentColorPicker`, `MiniatureResumePreview`, `PipelineProgress`, `Accordion`, `Badge` |
| `/showcase` | `Dialog`, `DropdownMenu`, `Tabs`, `SortableList`, `Toaster`, `Avatar`, `Separator`, `Input`, `Label`, `ThemeToggle` + every `Button`/`Badge` variant |

The `/try` route is the most interesting — a four-step wizard (input →
audience → accent → result) with a faked pipeline that runs in the browser
via `setTimeout`. No backend, no API calls, no auth provider; it's a working
demonstration of the wizard pattern the library was designed for.

## Component inventory

29 exports across 8 groups. See the docs app
([`npm run dev:docs`](./packages/docs)) for live examples + code snippets.

| Group | Exports |
| ----- | ------- |
| **Primitives** | `Button`, `Card` (+sub), `Textarea`, `Input`, `Label`, `Badge`, `Avatar`, `Separator`, `Accordion` |
| **Layout** | `SiteShell`, `PageHeader`, `ThemeToggle`, `ThemeProvider`, `useTheme` |
| **SEO** | `SeoProvider`, `SEO` |
| **Auth** | `RequireAuth` (provider-agnostic) |
| **Inputs** | `FileDropzone`, `TextInputCard`, `SegmentedTabs`, `EitherOrCard`, `Callout` |
| **Feedback** | `StatCarousel`, `PipelineProgress` |
| **Lists & pickers** | `SortableList`, `AccentColorPicker`, `MiniatureResumePreview` |
| **Overlays** | `Dialog`, `DropdownMenu`, `Tabs`, `Toaster` (Sonner) |
| **Utilities** | `cn`, `formatRelativeTime`, `wordCount` |

## Publishing

The library publishes as `@flux-ui/react`. See
[`packages/flux-ui/PUBLISHING.md`](./packages/flux-ui/PUBLISHING.md) for the
release checklist.

## More

- [`CLAUDE.md`](./CLAUDE.md) — extraction history, architecture decisions,
  how to extend, where the seams are
- [`packages/flux-ui/README.md`](./packages/flux-ui/README.md) — full library API
- [`packages/docs/`](./packages/docs) — live component playground
- [`sample/`](./sample) — Ember, a complete consumer example

## License

MIT
