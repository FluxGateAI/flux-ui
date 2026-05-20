import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children and forwards click handler', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('exposes data-variant and data-size attributes for testing', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Delete' })
    expect(btn).toHaveAttribute('data-variant', 'destructive')
    expect(btn).toHaveAttribute('data-size', 'lg')
  })

  it('renders via Slot when asChild', () => {
    render(
      <Button asChild>
        <a href="/somewhere">Linked</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Linked' })
    expect(link).toHaveAttribute('href', '/somewhere')
    expect(link).toHaveAttribute('data-slot', 'button')
  })

  it('respects disabled', async () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Off
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Off' })
    expect(btn).toBeDisabled()
    await userEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })
})
