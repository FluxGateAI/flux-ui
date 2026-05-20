# ResuMaker Frontend

React 19 + TypeScript 5.9 single-page application built with Vite 7.

## Development

```bash
npm install
npm run dev      # Dev server on http://localhost:3000
npm run build    # Production build to dist/
npm run lint     # ESLint (zero warnings enforced)
npm run preview  # Preview production build
```

The dev server proxies `/api` requests to the backend at `http://localhost:8000`.

## Stack

- **Vite 7** — dev server and build tool
- **React 19** — UI framework
- **TypeScript 5.9** — type safety
- **Tailwind CSS 4** — utility-first styling (CSS-first config via `@tailwindcss/vite`)
- **shadcn/ui** — component primitives (local copies in `src/components/ui/`)
- **react-dropzone** — file upload drag-and-drop

## Adding shadcn/ui components

```bash
npx shadcn@latest add <component-name>
```

Components are generated into `src/components/ui/` as local source files.

## Code quality

- **ESLint** with `--max-warnings=0` — no warnings tolerated
- **Prettier** with Tailwind class sorting — formatting is non-negotiable
- Both enforced via pre-commit hooks on every commit
