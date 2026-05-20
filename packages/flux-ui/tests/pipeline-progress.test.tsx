import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'

import { PipelineProgress } from '@/components/pipeline-progress'

const stages = [
  { key: 'parse', icon: <span>p</span>, title: 'Parsing', description: 'desc 1' },
  { key: 'analyze', icon: <span>a</span>, title: 'Analyzing', description: 'desc 2' },
  { key: 'render', icon: <span>r</span>, title: 'Rendering', description: 'desc 3' },
]

describe('PipelineProgress', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the running header by default and lists every stage', () => {
    render(
      <PipelineProgress
        stages={stages}
        done={false}
        onComplete={() => {}}
        runningTitle="Running…"
        runningSubtitle="Hang on"
      />,
    )
    expect(screen.getByText('Running…')).toBeInTheDocument()
    expect(screen.getByText('Hang on')).toBeInTheDocument()
    expect(screen.getByText('Parsing')).toBeInTheDocument()
    expect(screen.getByText('Analyzing')).toBeInTheDocument()
    expect(screen.getByText('Rendering')).toBeInTheDocument()
  })

  it('switches to the done copy when done=true', () => {
    render(
      <PipelineProgress
        stages={stages}
        done
        onComplete={() => {}}
        doneTitle="Finished"
        doneSubtitle="Yay"
      />,
    )
    expect(screen.getByText('Finished')).toBeInTheDocument()
    expect(screen.getByText('Yay')).toBeInTheDocument()
  })

  it('fires onComplete after holdMs once done becomes true', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(
      <PipelineProgress stages={stages} done onComplete={onComplete} holdMs={500} />,
    )
    expect(onComplete).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
