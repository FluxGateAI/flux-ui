import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SegmentedTabs } from '@/components/segmented-tabs'

describe('SegmentedTabs', () => {
  const tabs = [
    { value: 'a' as const, label: 'A' },
    { value: 'b' as const, label: 'B' },
  ]

  it('marks the active tab with aria-selected', () => {
    render(<SegmentedTabs tabs={tabs} value="b" onChange={() => {}} />)
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-selected', 'true')
  })

  it('invokes onChange with the next value', async () => {
    const onChange = vi.fn()
    render(<SegmentedTabs tabs={tabs} value="a" onChange={onChange} />)
    await userEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('applies aria-disabled when deemphasized', () => {
    render(
      <SegmentedTabs
        tabs={[
          { value: 'a' as const, label: 'A' },
          { value: 'b' as const, label: 'B', deemphasized: true },
        ]}
        value="a"
        onChange={() => {}}
      />,
    )
    expect(screen.getByRole('tab', { name: 'B' })).toHaveAttribute('aria-disabled', 'true')
  })
})
