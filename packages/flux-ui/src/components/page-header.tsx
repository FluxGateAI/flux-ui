import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

interface PageHeaderProps {
  title: ReactNode
  /** Tagline rendered immediately under the rule. */
  subtitle?: ReactNode
  /** Optional micro-copy under the subtitle. */
  description?: ReactNode
  /** Hide the gradient decorative rule between title and subtitle. */
  hideRule?: boolean
  /**
   * Visual scale. `lg` matches the landing-page hero (5.5rem → 7rem),
   * `md` matches the per-page hero (3.5rem → 4.5rem). Defaults to `md`.
   */
  size?: 'md' | 'lg'
  /** Override the default `text-center` layout. */
  align?: 'center' | 'left'
  /** Hide the entrance `hero-enter` animation. */
  noAnimation?: boolean
  className?: string
}

const SIZE_CLASSES = {
  md: 'text-[3.5rem] md:text-[4.5rem]',
  lg: 'text-[4.5rem] sm:text-[5.5rem] md:text-[7rem]',
} as const

/**
 * Display heading + decorative rule + subtitle, used as the hero of every
 * landing/marketing page. Stays consistent with the warm-editorial type
 * scale and the fade-up entrance animation.
 */
export function PageHeader({
  title,
  subtitle,
  description,
  hideRule = false,
  size = 'md',
  align = 'center',
  noAnimation = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8',
        align === 'center' && 'text-center',
        !noAnimation && 'hero-enter',
        className,
      )}
    >
      <h1
        className={cn(
          'font-display leading-none font-semibold tracking-tight text-foreground',
          SIZE_CLASSES[size],
        )}
      >
        {title}
      </h1>
      {!hideRule && (
        <div
          className={cn(
            'mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60',
            align === 'center' ? 'mx-auto' : 'ml-0',
            size === 'lg' && 'mt-5 w-20',
          )}
        />
      )}
      {subtitle && (
        <p className="mt-4 font-sans text-lg font-medium tracking-tight text-foreground">
          {subtitle}
        </p>
      )}
      {description && (
        <p
          className={cn(
            'mt-2 font-sans text-sm font-light tracking-[0.06em] text-muted-foreground',
            align === 'center' && 'mx-auto max-w-lg',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
