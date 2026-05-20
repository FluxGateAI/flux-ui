import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { StatCarousel } from '@/components/stat-carousel'

const stats = [
  { value: '1x', label: 'first stat' },
  { value: '2x', label: 'second stat' },
]

describe('StatCarousel', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the active stat value and label', () => {
    render(<StatCarousel stats={stats} intervalMs={9999} />)
    expect(screen.getByText('1x')).toBeInTheDocument()
    expect(screen.getByText('first stat')).toBeInTheDocument()
  })

  it('advances to the next stat after intervalMs', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<StatCarousel stats={stats} intervalMs={500} />)
    expect(screen.getByText('first stat')).toBeInTheDocument()
    await act(async () => {
      vi.advanceTimersByTime(500)
      vi.advanceTimersByTime(300)
    })
    expect(screen.getByText('second stat')).toBeInTheDocument()
  })

  it('jumps via dot navigation', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    render(<StatCarousel stats={stats} intervalMs={9999} />)
    const dots = screen.getAllByRole('button')
    expect(dots).toHaveLength(2)
    await userEvent.click(dots[1])
    await act(async () => {
      vi.advanceTimersByTime(350)
    })
    expect(screen.getByText('second stat')).toBeInTheDocument()
  })
})
