import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SiteShell, ThemeToggle } from '@/components/site-shell'
import { ThemeProvider } from '@/theme/theme-provider'

const renderShell = (props: Parameters<typeof SiteShell>[0]) =>
  render(<ThemeProvider>{<SiteShell {...props} />}</ThemeProvider>)

describe('SiteShell', () => {
  it('renders brand name and main children', () => {
    renderShell({
      brand: { name: 'Acme' },
      children: <p>Body content</p>,
    })
    expect(screen.getAllByText('Acme').length).toBeGreaterThan(0)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders nav links', () => {
    renderShell({
      brand: { name: 'Acme' },
      navLinks: [
        { label: 'Docs', to: '/docs' },
        { label: 'Blog', href: 'https://example.com/blog' },
      ],
      children: <p>x</p>,
    })
    expect(screen.getAllByText('Docs').length).toBeGreaterThan(0)
    const ext = screen.getByText('Blog')
    expect(ext).toHaveAttribute('target', '_blank')
  })

  it('renders the footer copyright with the brand name and current year', () => {
    renderShell({ brand: { name: 'Acme' }, children: <p>x</p> })
    const year = String(new Date().getFullYear())
    expect(screen.getByText(new RegExp(`${year}.*Acme`))).toBeInTheDocument()
  })

  it('renders custom footer copyright when provided', () => {
    renderShell({
      brand: { name: 'Acme' },
      footerCopyright: <span>Custom copy</span>,
      children: <p>x</p>,
    })
    expect(screen.getByText('Custom copy')).toBeInTheDocument()
  })

  it('renders authSlot at the top of the nav', () => {
    renderShell({
      brand: { name: 'Acme' },
      authSlot: <button>Sign in</button>,
      children: <p>x</p>,
    })
    expect(screen.getAllByRole('button', { name: 'Sign in' }).length).toBeGreaterThan(0)
  })
})

describe('ThemeToggle', () => {
  it('toggles between Dark mode and Light mode labels', async () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>,
    )
    expect(screen.getByText('Light mode')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Toggle theme/ }))
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })
})
