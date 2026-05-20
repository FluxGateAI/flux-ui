import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

describe('Badge', () => {
  it('renders children with default variant', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText('New')
    expect(badge).toHaveAttribute('data-slot', 'badge')
  })

  it('supports asChild rendering', () => {
    render(
      <Badge asChild>
        <a href="/x">Link</a>
      </Badge>,
    )
    const link = screen.getByRole('link', { name: 'Link' })
    expect(link).toHaveAttribute('href', '/x')
  })
})

describe('Separator', () => {
  it('defaults to horizontal orientation', () => {
    const { container } = render(<Separator />)
    const sep = container.querySelector('[data-slot="separator-root"]')
    expect(sep).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('honors orientation prop', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const sep = container.querySelector('[data-slot="separator-root"]')
    expect(sep).toHaveAttribute('data-orientation', 'vertical')
  })
})

describe('Avatar', () => {
  it('renders fallback when image is absent', () => {
    render(
      <Avatar>
        <AvatarFallback>OK</AvatarFallback>
      </Avatar>,
    )
    expect(screen.getByText('OK')).toBeInTheDocument()
  })
})
