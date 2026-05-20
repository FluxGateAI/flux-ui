import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

describe('Input', () => {
  it('forwards onChange and value', async () => {
    const onChange = vi.fn()
    render(<Input placeholder="Email" value="" onChange={onChange} />)
    const input = screen.getByPlaceholderText('Email')
    await userEvent.type(input, 'hi')
    expect(onChange).toHaveBeenCalled()
  })

  it('respects type="password"', () => {
    render(<Input type="password" placeholder="pw" />)
    expect(screen.getByPlaceholderText('pw')).toHaveAttribute('type', 'password')
  })
})

describe('Textarea', () => {
  it('renders as a textarea element', () => {
    render(<Textarea placeholder="notes" />)
    const ta = screen.getByPlaceholderText('notes')
    expect(ta.tagName).toBe('TEXTAREA')
    expect(ta).toHaveAttribute('data-slot', 'textarea')
  })
})

describe('Label', () => {
  it('renders associated label text', () => {
    render(<Label htmlFor="x">Name</Label>)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })
})
