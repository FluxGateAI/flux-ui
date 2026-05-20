import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Callout, EitherOrCard } from '@/components/either-or-card'

const options = [
  {
    id: 'a' as const,
    label: 'Option A',
    placeholder: 'Type for A',
    sectionLabel: '↳ section A',
  },
  {
    id: 'b' as const,
    label: 'Option B',
    placeholder: 'Type for B',
    sectionLabel: '↳ section B',
  },
]

describe('EitherOrCard', () => {
  it('disables continue until the user types something', async () => {
    const onContinue = vi.fn()
    render(
      <EitherOrCard options={options} title="Pick one" onContinue={onContinue} />,
    )
    const continueBtn = screen.getByRole('button', { name: /Continue/ })
    expect(continueBtn).toBeDisabled()
    await userEvent.type(screen.getByPlaceholderText('Type for A'), 'hello')
    expect(continueBtn).not.toBeDisabled()
    await userEvent.click(continueBtn)
    expect(onContinue).toHaveBeenCalledWith('a', 'hello')
  })

  it('switches the placeholder when a different option is selected', async () => {
    render(<EitherOrCard options={options} title="x" onContinue={() => {}} />)
    expect(screen.getByPlaceholderText('Type for A')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('tab', { name: 'Option B' }))
    expect(screen.getByPlaceholderText('Type for B')).toBeInTheDocument()
  })

  it('renders an optional back button when onBack provided', async () => {
    const onBack = vi.fn()
    render(
      <EitherOrCard options={options} title="x" onContinue={() => {}} onBack={onBack} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Back/ }))
    expect(onBack).toHaveBeenCalled()
  })

  it('renders an error banner when error prop is set', () => {
    render(
      <EitherOrCard
        options={options}
        title="x"
        onContinue={() => {}}
        error="Something failed"
      />,
    )
    expect(screen.getByText('Something failed')).toBeInTheDocument()
  })
})

describe('Callout', () => {
  it('renders content with the chosen tone class', () => {
    const { container } = render(<Callout tone="destructive">Boom</Callout>)
    expect(screen.getByText('Boom')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('text-destructive')
  })
})
