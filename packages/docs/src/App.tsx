import { Link, Route, Routes, useLocation } from 'react-router-dom'

import { SiteShell, type NavLink as FluxNavLink } from '@flux-ui/react'

import { IndexPage } from './pages/index-page'
import { PrimitivesPage } from './pages/primitives'
import { LayoutPage } from './pages/layout'
import { InputsPage } from './pages/inputs'
import { DataEntryPage } from './pages/data-entry'
import { FeedbackPage } from './pages/feedback'
import { ListsPage } from './pages/lists'
import { OverlaysPage } from './pages/overlays'

const navLinks: FluxNavLink[] = [
  { label: 'Primitives', to: '/primitives' },
  { label: 'Layout', to: '/layout' },
  { label: 'Inputs', to: '/inputs' },
  { label: 'Data entry', to: '/data-entry' },
  { label: 'Feedback', to: '/feedback' },
  { label: 'Lists', to: '/lists' },
  { label: 'Overlays', to: '/overlays' },
]

const FluxLink = ({ to, className, children }: { to: string; className?: string; children?: React.ReactNode }) => (
  <Link to={to} className={className}>
    {children}
  </Link>
)

export function App() {
  const location = useLocation()

  return (
    <SiteShell
      brand={{ name: '@flux-ui/react', href: '/' }}
      navLinks={navLinks}
      LinkComponent={FluxLink}
      footerLinks={[
        { label: 'README', href: 'https://github.com/' },
        { label: 'Issues', href: 'https://github.com/' },
      ]}
    >
      <div key={location.pathname} className="w-full max-w-5xl">
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/primitives" element={<PrimitivesPage />} />
          <Route path="/layout" element={<LayoutPage />} />
          <Route path="/inputs" element={<InputsPage />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/overlays" element={<OverlaysPage />} />
        </Routes>
      </div>
    </SiteShell>
  )
}
