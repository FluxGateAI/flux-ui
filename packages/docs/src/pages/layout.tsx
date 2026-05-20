import { PageHeader, ThemeToggle } from '@flux-ui/react'

import { Section, Showcase } from './showcase'

export function LayoutPage() {
  return (
    <Section title="Layout" intro="Page-level scaffolding: shell, headers, theme toggle.">
      <Showcase
        title="PageHeader"
        description="Display heading + decorative rule + subtitle. Use size 'lg' for landing heroes."
        code={`<PageHeader
  title="Welcome"
  subtitle="The headline tagline"
  description="A smaller bit of supporting copy."
/>`}
      >
        <PageHeader
          title="Welcome"
          subtitle="The headline tagline"
          description="A smaller bit of supporting copy."
        />
      </Showcase>

      <Showcase
        title="PageHeader (size lg)"
        code={`<PageHeader title="Big" size="lg" subtitle="Landing heroes" />`}
      >
        <PageHeader title="Big" size="lg" subtitle="Landing heroes" />
      </Showcase>

      <Showcase
        title="ThemeToggle"
        description="Pairs with ThemeProvider; persists the user choice in localStorage."
        code={`<ThemeProvider>
  <ThemeToggle />
</ThemeProvider>`}
      >
        <ThemeToggle />
      </Showcase>

      <Showcase
        title="SiteShell"
        description="You are looking at it. See the surrounding nav + footer chrome — that's SiteShell. View packages/docs/src/App.tsx for the wiring."
        code={`<SiteShell
  brand={{ name: 'Acme', href: '/' }}
  navLinks={[{ label: 'Docs', to: '/docs' }]}
  LinkComponent={Link}
  footerLinks={[{ label: 'GitHub', href: 'https://github.com' }]}
>
  <Outlet />
</SiteShell>`}
      >
        <p className="text-center text-sm text-muted-foreground">
          The nav, grain overlay, ambient glow, and footer you see around this page all come from
          SiteShell. Configure it with `brand`, `navLinks`, `authSlot`, `footerLinks`, and an
          optional `LinkComponent` (e.g. react-router&apos;s `Link`).
        </p>
      </Showcase>
    </Section>
  )
}
