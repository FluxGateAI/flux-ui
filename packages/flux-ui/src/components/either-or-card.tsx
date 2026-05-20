import { useState, type ReactNode } from 'react'

import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { SegmentedTabs, type SegmentedTab } from './segmented-tabs'
import { PageHeader } from './page-header'
import { cn } from '../lib/cn'
import { wordCount } from '../lib/format'

export interface EitherOrOption<TId extends string = string> {
  id: TId
  label: string
  icon?: ReactNode
  /** Placeholder shown in the textarea when this option is active. */
  placeholder: string
  /** Optional sub-label rendered above the textarea (e.g. "↳ Paste the job description"). */
  sectionLabel?: string
}

interface EitherOrCardProps<TId extends string> {
  options: EitherOrOption<TId>[]
  defaultSelectedId?: TId
  /** Page header title. */
  title: ReactNode
  /** Page header subtitle. */
  subtitle?: ReactNode
  /** Optional callout banner (e.g. a stat). Rendered above the textarea. */
  callout?: ReactNode
  /** Optional error banner rendered above the callout. */
  error?: string | null
  /** Maximum characters allowed in the textarea. */
  maxChars?: number
  /** When true, the continue button is disabled and shows a loading affordance. */
  busy?: boolean
  /** Label for the continue button. */
  continueLabel?: ReactNode
  /** Continue handler. Receives the selected id and the textarea content. */
  onContinue: (id: TId, text: string) => void
  /** Optional back button handler. When provided, a back button is rendered above the header. */
  onBack?: () => void
  className?: string
}

function BackIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

/**
 * Two-or-more option picker with a single textarea below. The choice is
 * tracked locally; the parent only receives the final `(id, text)` on
 * continue. The optional callout/error banners sit between the pill
 * switcher and the textarea.
 */
export function EitherOrCard<TId extends string>({
  options,
  defaultSelectedId,
  title,
  subtitle,
  callout,
  error,
  maxChars = 15_000,
  busy = false,
  continueLabel = 'Continue',
  onContinue,
  onBack,
  className,
}: EitherOrCardProps<TId>) {
  const [selectedId, setSelectedId] = useState<TId>(defaultSelectedId ?? options[0]?.id)
  const [text, setText] = useState('')

  const words = wordCount(text)
  const chars = text.length
  const nearLimit = chars >= maxChars * 0.9
  const atLimit = chars >= maxChars

  const activeOption = options.find((o) => o.id === selectedId)
  const placeholder = activeOption?.placeholder ?? ''
  const sectionLabel = activeOption?.sectionLabel

  const canContinue = text.trim().length > 0 && !busy && !error

  const tabs: SegmentedTab<TId>[] = options.map((opt) => ({
    value: opt.id,
    label: opt.label,
    icon: opt.icon,
    hasData: text.trim().length > 0 && opt.id === selectedId,
  }))

  return (
    <div className={cn('w-full max-w-2xl', className)}>
      {onBack && (
        <div className="mb-12 flex hero-enter justify-center">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 font-sans text-sm text-muted-foreground transition-all duration-200 hover:text-foreground active:scale-[0.97]"
          >
            <span className="transition-transform duration-200 group-hover:translate-x-[-3px]">
              <BackIcon />
            </span>
            Back
          </button>
        </div>
      )}

      <PageHeader title={title} description={subtitle} className="mb-10" />

      <SegmentedTabs<TId>
        className="card-enter-1"
        tabs={tabs}
        value={selectedId}
        onChange={setSelectedId}
      />

      {error && (
        <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3">
          <p className="font-sans text-sm text-destructive">{error}</p>
        </div>
      )}

      {callout && <div className="mt-4">{callout}</div>}

      <div className="mt-4 card-enter-2">
        {sectionLabel && (
          <p className="mb-2.5 font-sans text-[11px] font-medium tracking-[0.12em] text-primary/70 uppercase">
            {sectionLabel}
          </p>
        )}
        <Textarea
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxChars}
          className="min-h-[200px] resize-none border-border/60 font-sans text-sm leading-relaxed placeholder:text-muted-foreground/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
        />
        {words > 0 && (
          <p
            className={cn(
              'mt-1.5 text-right font-sans text-xs tabular-nums',
              atLimit
                ? 'text-destructive'
                : nearLimit
                  ? 'text-amber-500'
                  : 'text-muted-foreground/50',
            )}
          >
            {words.toLocaleString()} {words === 1 ? 'word' : 'words'} · {chars.toLocaleString()}/
            {maxChars.toLocaleString()}
          </p>
        )}
      </div>

      <div className="mt-8 flex card-enter-3 justify-center">
        <Button
          disabled={!canContinue}
          onClick={() => onContinue(selectedId, text)}
          className="h-10 gap-2 rounded-full px-6 font-sans text-sm font-medium transition-all active:scale-[0.97]"
        >
          {continueLabel}
          <ArrowIcon />
        </Button>
      </div>
    </div>
  )
}

interface CalloutProps {
  icon?: ReactNode
  children: ReactNode
  /** Color preset. `primary` (amber), `destructive`, or `muted`. Defaults to `primary`. */
  tone?: 'primary' | 'destructive' | 'muted'
  className?: string
}

const TONE_CLASSES = {
  primary: 'border-primary/30 bg-primary/8 text-primary',
  destructive: 'border-destructive/30 bg-destructive/8 text-destructive',
  muted: 'border-border bg-muted/60 text-muted-foreground',
} as const

export function Callout({ icon, children, tone = 'primary', className }: CalloutProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-lg border px-4 py-3',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <p className="font-sans text-sm font-medium">{children}</p>
    </div>
  )
}
