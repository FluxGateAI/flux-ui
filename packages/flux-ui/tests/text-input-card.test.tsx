import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TextInputCard } from '@/components/text-input-card'

describe('TextInputCard', () => {
  it('renders with custom title/subtitle and forwards onChange', async () => {
    const onChange = vi.fn()
    render(
      <TextInputCard
        value=""
        onChange={onChange}
        title="Your Background"
        subtitle="Tell us about yourself"
        placeholder="Type here…"
      />,
    )
    expect(screen.getByText('Your Background')).toBeInTheDocument()
    expect(screen.getByText('Tell us about yourself')).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText('Type here…'), 'a')
    expect(onChange).toHaveBeenLastCalledWith('a')
  })

  it('shows word + character counter once text is present', () => {
    render(<TextInputCard value="one two three" onChange={() => {}} maxChars={1000} />)
    expect(screen.getByText(/3 words/)).toBeInTheDocument()
    expect(screen.getByText(/13\/1,000/)).toBeInTheDocument()
  })

  it('hides counter when showCounter is false', () => {
    render(<TextInputCard value="hi" onChange={() => {}} showCounter={false} />)
    expect(screen.queryByText(/word/i)).not.toBeInTheDocument()
  })
})
