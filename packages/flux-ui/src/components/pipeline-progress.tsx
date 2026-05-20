import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'

import { cn } from '../lib/cn'

export interface PipelineStage {
  key: string
  icon: ReactNode
  title: string
  description?: string
}

export interface PipelineProgressProps {
  stages: PipelineStage[]
  /** When true, every stage is forced to "done" and `onComplete` fires after `holdMs`. */
  done: boolean
  onComplete: () => void
  /** Identifies the most recently *completed* stage. Stages up to this key render as done; the next renders as active. */
  currentStepKey?: string
  /** Header copy while running. */
  runningTitle?: string
  runningSubtitle?: string
  /** Header copy when `done === true`. */
  doneTitle?: string
  doneSubtitle?: string
  /** Time to wait before firing `onComplete` once `done` flips to true. Defaults to 1000ms. */
  holdMs?: number
  className?: string
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

interface StageRowProps {
  icon: ReactNode
  title: string
  description?: string
  status: 'pending' | 'active' | 'done'
  isLast: boolean
}

function StageRow({ icon, title, description, status, isLast }: StageRowProps) {
  return (
    <div className={cn('flex items-start gap-4 py-4', !isLast && 'border-b border-border/40')}>
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-all duration-500',
          status === 'done'
            ? 'border-primary/30 bg-primary/10 text-primary'
            : status === 'active'
              ? 'border-primary/40 bg-primary/8 text-primary'
              : 'border-border bg-muted text-muted-foreground/40',
        )}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p
          className={cn(
            'font-sans text-sm font-medium transition-colors duration-500',
            status === 'pending' ? 'text-muted-foreground/40' : 'text-foreground',
          )}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn(
              'mt-0.5 font-sans text-xs leading-relaxed transition-colors duration-500',
              status === 'pending' ? 'text-muted-foreground/30' : 'text-muted-foreground',
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div className="mt-1 shrink-0">
        {status === 'done' ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckIcon />
          </span>
        ) : status === 'active' ? (
          <span className="flex h-5 w-5 items-center justify-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </span>
        ) : (
          <span className="flex h-5 w-5 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-border" />
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Animated pipeline stage list. Stage status is derived from the
 * `currentStepKey` — each event from your backend that "completes" a stage
 * should update that prop. When `done` becomes true, all stages mark as
 * complete and the `onComplete` callback fires after `holdMs`.
 */
export function PipelineProgress({
  stages,
  done,
  onComplete,
  currentStepKey,
  runningTitle = 'Working…',
  runningSubtitle = 'Sit tight — this usually takes a few seconds.',
  doneTitle = 'All done.',
  doneSubtitle = 'Complete.',
  holdMs = 1000,
  className,
}: PipelineProgressProps) {
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const completedIdx = useMemo(
    () =>
      currentStepKey === undefined
        ? -1
        : stages.findIndex((s) => s.key === currentStepKey || s.title === currentStepKey),
    [currentStepKey, stages],
  )

  const getStatus = useCallback(
    (stepKey: string): 'pending' | 'active' | 'done' => {
      if (done) return 'done'
      const idx = stages.findIndex((s) => s.key === stepKey)
      if (completedIdx === -1) return idx === 0 ? 'active' : 'pending'
      if (idx <= completedIdx) return 'done'
      if (idx === completedIdx + 1) return 'active'
      return 'pending'
    },
    [done, completedIdx, stages],
  )

  useEffect(() => {
    if (!done) return
    const t = window.setTimeout(() => onCompleteRef.current(), holdMs)
    return () => clearTimeout(t)
  }, [done, holdMs])

  return (
    <div className={cn('w-full max-w-xl', className)}>
      <div className="mb-10 hero-enter text-center">
        <h2 className="font-display text-[3.5rem] leading-none font-semibold tracking-tight text-foreground md:text-[4.5rem]">
          {done ? doneTitle : runningTitle}
        </h2>
        <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        <p className="mt-4 font-sans text-sm font-light tracking-[0.06em] text-muted-foreground">
          {done ? doneSubtitle : runningSubtitle}
        </p>
      </div>

      <div className="card-enter-1 rounded-xl border border-border/60 bg-card px-6">
        {stages.map((stage, i) => (
          <StageRow
            key={stage.key}
            icon={stage.icon}
            title={stage.title}
            description={stage.description}
            status={getStatus(stage.key)}
            isLast={i === stages.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
