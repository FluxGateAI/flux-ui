import type { ReactNode } from 'react'

import { Card, PageHeader, cn } from '@flux-ui/react'

interface ShowcaseProps {
  title: ReactNode
  description?: ReactNode
  code: string
  children: ReactNode
  /** Override the demo container background — useful when the component already supplies one. */
  surfaceClassName?: string
}

/** Side-by-side preview + code snippet for every example. */
export function Showcase({ title, description, code, children, surfaceClassName }: ShowcaseProps) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description && (
        <p className="mt-1 font-sans text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className={cn('overflow-hidden p-6', surfaceClassName)}>
          <div className="flex min-h-[200px] items-center justify-center">{children}</div>
        </Card>
        <pre className="docs-prose overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-4 font-sans text-xs leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </section>
  )
}

interface SectionProps {
  title: ReactNode
  intro?: ReactNode
  children: ReactNode
}

export function Section({ title, intro, children }: SectionProps) {
  return (
    <div className="py-6">
      <PageHeader title={title} description={intro} className="mb-10" />
      {children}
    </div>
  )
}
