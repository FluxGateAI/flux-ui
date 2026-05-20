import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '../lib/cn'

export interface Stat {
  value: string
  label: string
  source?: string
}

interface StatCarouselProps {
  stats: Stat[]
  /** Interval in milliseconds between auto-advances. Defaults to 4500ms. */
  intervalMs?: number
  className?: string
}

export function StatCarousel({ stats, intervalMs = 4500, className }: StatCarouselProps) {
  const [active, setActive] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const advance = useCallback(() => {
    if (stats.length <= 1) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActive((prev) => (prev + 1) % stats.length)
      setIsTransitioning(false)
    }, 300)
  }, [stats.length])

  useEffect(() => {
    if (stats.length <= 1) return
    timerRef.current = setTimeout(advance, intervalMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, advance, intervalMs, stats.length])

  const goTo = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (index === active) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActive(index)
      setIsTransitioning(false)
    }, 300)
  }

  const stat = stats[active]
  if (!stat) return null

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div
        className={cn(
          'flex flex-col items-center justify-center transition-all duration-300',
          isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100',
        )}
      >
        <p className="stat-value font-display text-[4rem] leading-tight font-semibold tracking-tight md:text-[5.5rem]">
          {stat.value}
        </p>
        <p className="mt-3 max-w-xs text-center font-sans text-sm tracking-[0.04em] text-muted-foreground">
          {stat.label}
        </p>
        <div className="mt-2 h-4">
          {stat.source && (
            <p className="font-sans text-[10px] tracking-wide text-muted-foreground/30">
              {stat.source}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {stats.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Show stat ${i + 1}`}
            className="group relative flex h-5 items-center justify-center"
          >
            <span
              className={cn(
                'block rounded-full transition-all duration-500',
                i === active
                  ? 'h-2 w-6 bg-primary/80'
                  : 'h-1.5 w-1.5 bg-muted-foreground/20 group-hover:bg-muted-foreground/40',
              )}
            />
            {i === active && (
              <span
                key={`fill-${active}`}
                className="stat-progress absolute left-0 h-2 rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
