import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

export interface SegmentedTab<TValue extends string = string> {
  value: TValue
  label: ReactNode
  /** Optional leading icon. */
  icon?: ReactNode
  /** When true, render a small amber "data dot" next to the label (used to signal hidden content). */
  hasData?: boolean
  /** When true, fade the tab and remove its hover affordances (still clickable). */
  deemphasized?: boolean
  ariaLabel?: string
}

interface SegmentedTabsProps<TValue extends string> {
  tabs: SegmentedTab<TValue>[]
  value: TValue
  onChange: (next: TValue) => void
  className?: string
  /** Aria label for the group. */
  ariaLabel?: string
}

/**
 * Pill-style segmented switcher with the "soft de-emphasis" pattern from
 * the design language. When one tab has content but isn't active, mark
 * the *other* tabs with `deemphasized: true` — they'll fade to 50% but
 * remain clickable. Optional `hasData: true` on a tab renders an amber
 * dot indicator.
 */
export function SegmentedTabs<TValue extends string>({
  tabs,
  value,
  onChange,
  className,
  ariaLabel,
}: SegmentedTabsProps<TValue>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('flex rounded-full border border-border bg-muted/60 p-1', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-label={tab.ariaLabel}
            aria-disabled={tab.deemphasized || undefined}
            onClick={() => onChange(tab.value)}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-sans text-sm font-medium transition-all duration-200 active:scale-[0.98]',
              isActive
                ? 'bg-card text-foreground shadow-sm'
                : tab.deemphasized
                  ? 'text-muted-foreground opacity-50'
                  : 'text-muted-foreground hover:bg-card/50 hover:text-foreground',
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.hasData && <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-primary" />}
          </button>
        )
      })}
    </div>
  )
}
