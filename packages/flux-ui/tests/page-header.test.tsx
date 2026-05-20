import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { PageHeader } from '@/components/page-header'

describe('PageHeader', () => {
  it('renders the title, subtitle, and description', () => {
    render(
      <PageHeader title="Welcome" subtitle="The tagline" description="Some smaller description." />,
    )
    expect(screen.getByRole('heading', { name: 'Welcome' })).toBeInTheDocument()
    expect(screen.getByText('The tagline')).toBeInTheDocument()
    expect(screen.getByText('Some smaller description.')).toBeInTheDocument()
  })

  it('hides the decorative rule when hideRule is set', () => {
    const { container } = render(<PageHeader title="x" hideRule />)
    expect(container.querySelector('.bg-gradient-to-r')).toBeNull()
  })

  it('applies size=lg classes', () => {
    render(<PageHeader title="big" size="lg" />)
    const h1 = screen.getByRole('heading', { name: 'big' })
    expect(h1.className).toMatch(/text-\[7rem\]/)
  })
})
