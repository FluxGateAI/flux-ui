import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

import { Badge, Button, Card, CardContent, PageHeader, SEO } from '@flux-ui/react'

interface Tier {
  name: string
  price: ReactNode
  period: string
  blurb: string
  features: string[]
  cta: ReactNode
  highlighted?: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    blurb: 'For experimenting with the wizard and sharing a single doc per month.',
    features: [
      '1 document per month',
      'Summary, FAQ, and one-pager outputs',
      'Markdown export',
      'Community support',
    ],
    cta: (
      <Button asChild variant="outline" className="h-10 w-full rounded-full font-sans text-sm">
        <Link to="/try">Start free</Link>
      </Button>
    ),
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    blurb: 'For consultants, founders, and product managers who ship docs every week.',
    features: [
      'Unlimited documents',
      'All output formats including DOCX + PDF',
      'Style rules: customise the polish stage',
      'Priority email support',
    ],
    cta: (
      <Button className="h-10 w-full rounded-full font-sans text-sm">Start the Pro trial</Button>
    ),
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$59',
    period: 'per editor / month',
    blurb: 'For small teams that share a tone of voice and a library of source docs.',
    features: [
      'Everything in Pro',
      'Shared source library and templates',
      'Per-team style rules',
      'SSO and audit log',
    ],
    cta: (
      <Button variant="outline" className="h-10 w-full rounded-full font-sans text-sm">
        Talk to us
      </Button>
    ),
  },
]

const COMPARISON = [
  { label: 'Documents per month', values: ['1', 'Unlimited', 'Unlimited'] },
  { label: 'Output formats', values: ['Markdown', 'MD · DOCX · PDF', 'MD · DOCX · PDF'] },
  { label: 'Style rules', values: ['Default', 'Customise', 'Team-wide'] },
  { label: 'Source library', values: ['—', 'Personal', 'Shared'] },
  { label: 'SSO + audit log', values: ['—', '—', 'Included'] },
  { label: 'Support', values: ['Community', 'Priority email', 'Dedicated channel'] },
]

export function Component() {
  return (
    <>
      <SEO
        title="Pricing"
        description="Simple, generous pricing for Ember. Free for one doc a month; $19 for unlimited; $59 per editor for teams."
        path="/pricing"
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <PageHeader
          title="Simple pricing"
          description="One free document a month is enough to fall in love. Upgrade when you outgrow it."
        />

        <div className="mt-12 grid card-enter-1 grid-cols-1 gap-4 md:grid-cols-3">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={
                tier.highlighted
                  ? 'card-lift relative overflow-hidden border-primary/60 bg-card shadow-md'
                  : 'card-lift'
              }
            >
              {tier.highlighted && (
                <div className="absolute right-4 top-4">
                  <Badge>Most popular</Badge>
                </div>
              )}
              <CardContent className="flex flex-col gap-5">
                <div>
                  <p className="font-sans text-sm font-medium tracking-wide uppercase text-muted-foreground">
                    {tier.name}
                  </p>
                  <p className="mt-3 font-display text-5xl font-semibold tracking-tight text-foreground">
                    {tier.price}
                    <span className="ml-2 font-sans text-sm font-light text-muted-foreground">
                      {tier.period}
                    </span>
                  </p>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                    {tier.blurb}
                  </p>
                </div>

                <ul className="flex flex-col gap-2 border-t border-border/40 pt-5 font-sans text-sm text-foreground">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {tier.cta}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 card-enter-2 overflow-hidden rounded-2xl border border-border/60 bg-card">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-6 py-4 text-left font-medium text-muted-foreground">Compare</th>
                {TIERS.map((t) => (
                  <th key={t.name} className="px-6 py-4 text-left font-medium text-foreground">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-border/30 last:border-b-0">
                  <td className="px-6 py-4 text-muted-foreground">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="px-6 py-4 text-foreground">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-center font-sans text-[11px] tracking-wide text-muted-foreground/60">
          Prices for demo purposes. No real billing wired up in this sample.
        </p>
      </div>
    </>
  )
}
