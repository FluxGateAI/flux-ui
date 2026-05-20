import { Link, Outlet } from 'react-router-dom'

import { Button, SiteShell, type NavLink } from '@flux-ui/react'

const NAV_LINKS: NavLink[] = [
  { label: 'Approach', to: '/approach' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Showcase', to: '/showcase' },
]

const FOOTER_LINKS = [
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Privacy', href: '#privacy' },
  { label: 'Terms', href: '#terms' },
]

const RouterLink = ({
  to,
  className,
  children,
}: {
  to: string
  className?: string
  children?: React.ReactNode
}) => (
  <Link to={to} className={className}>
    {children}
  </Link>
)

function CallToAction() {
  return (
    <Button asChild size="sm" className="h-8 rounded-full px-4 font-sans text-xs">
      <Link to="/try">Try Ember</Link>
    </Button>
  )
}

export default function App() {
  return (
    <SiteShell
      brand={{ name: 'Ember', href: '/' }}
      navLinks={NAV_LINKS}
      LinkComponent={RouterLink}
      footerLinks={FOOTER_LINKS}
      authSlot={<CallToAction />}
    >
      <Outlet />
    </SiteShell>
  )
}
