import { Card, CardContent } from './ui/card'
import { Textarea } from './ui/textarea'
import { cn } from '../lib/cn'
import { wordCount } from '../lib/format'

interface TextInputCardProps {
  value: string
  onChange: (value: string) => void
  /** Card header title. */
  title?: string
  /** Card header subtitle. */
  subtitle?: string
  /** Textarea placeholder. */
  placeholder?: string
  /** Caption below the textarea. */
  hint?: string
  /** Maximum characters. The counter warns at 90% of this and errors at 100%. */
  maxChars?: number
  /** Show the word/character counter. Defaults to true. */
  showCounter?: boolean
  className?: string
}

function ListIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  )
}

export function TextInputCard({
  value,
  onChange,
  title = 'Your text',
  subtitle = 'Free-form — the more context, the better',
  placeholder = 'Type or paste your content here…',
  hint = 'No formatting needed — write as much or as little as you like.',
  maxChars = 20_000,
  showCounter = true,
  className,
}: TextInputCardProps) {
  const words = wordCount(value)
  const chars = value.length
  const nearLimit = chars >= maxChars * 0.9
  const atLimit = chars >= maxChars

  return (
    <Card className={cn('card-lift flex h-full flex-col overflow-hidden border-border/80', className)}>
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
          <ListIcon />
        </div>
        <div>
          <p className="font-sans text-sm font-medium text-foreground">{title}</p>
          <p className="font-sans text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <Textarea
          placeholder={placeholder}
          className="min-h-0 flex-1 resize-none border-border/60 font-sans text-sm leading-relaxed placeholder:text-muted-foreground/50 focus-visible:border-primary/50 focus-visible:ring-primary/20"
          maxLength={maxChars}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {showCounter && (
          <div className="mt-2.5 flex items-center justify-between">
            <p className="font-sans text-xs text-muted-foreground/60">{hint}</p>
            <span
              className={cn(
                'font-sans text-xs tabular-nums',
                atLimit
                  ? 'text-destructive'
                  : nearLimit
                    ? 'text-amber-500'
                    : 'text-muted-foreground/50',
              )}
            >
              {words > 0 && `${words.toLocaleString()} ${words === 1 ? 'word' : 'words'} · `}
              {chars.toLocaleString()}/{maxChars.toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
