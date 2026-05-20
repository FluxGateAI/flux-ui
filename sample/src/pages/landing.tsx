import { Link } from 'react-router-dom'

import { Button, Card, CardContent, PageHeader, SEO, StatCarousel, type Stat } from '@flux-ui/react'

const STATS: Stat[] = [
  { value: '4×', label: 'faster than writing your one-pager from scratch' },
  {
    value: '83%',
    label: 'of execs scan a doc in under two minutes',
    source: 'Microsoft, 2024',
  },
  { value: '3 min', label: 'median round-trip from rough notes to polished draft' },
  {
    value: '58%',
    label: 'of busy readers prefer summaries over full documents',
    source: 'Pew Research, 2023',
  },
]

const FEATURES = [
  {
    title: 'Drop anything in',
    body: 'PDFs, Word docs, raw notes, or a paste from your Notion scratchpad. Ember reads it all.',
  },
  {
    title: 'Pick the output you need',
    body: 'Executive summary, FAQ, or one-pager — each tuned to a different audience and length.',
  },
  {
    title: 'Edit, iterate, export',
    body: 'Inline accept/reject, regenerate sections you don’t like, export to PDF or Markdown.',
  },
]

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

export function Component() {
  return (
    <>
      <SEO
        title="Ember — Turn rough notes into polished writing"
        rawTitle
        path="/"
      />

      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        <PageHeader
          title="Ember"
          size="lg"
          subtitle="Turn rough notes into polished writing."
          description="Drop your raw thinking in. Get back a one-pager, summary, or FAQ — tuned for the audience you have in mind."
        />

        <div className="mt-10 flex card-enter-1 flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            className="h-11 gap-2 rounded-full px-8 font-sans text-sm font-medium active:scale-[0.97]"
          >
            <Link to="/try">
              Try the live demo
              <ArrowIcon />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-11 gap-2 rounded-full px-6 font-sans text-sm text-muted-foreground hover:text-foreground"
          >
            <Link to="/approach">How it works</Link>
          </Button>
        </div>
        <p className="mt-4 font-sans text-[11px] tracking-wide text-muted-foreground/50">
          No sign-up · Works in your browser · Demo runs without a backend
        </p>

        <div className="mt-16 w-full card-enter-2">
          <StatCarousel stats={STATS} />
        </div>

        <div className="mt-20 grid w-full card-enter-3 grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map(({ title, body }) => (
            <Card key={title} className="card-lift text-left">
              <CardContent>
                <p className="font-display text-xl font-semibold tracking-tight">{title}</p>
                <p className="mt-2 font-sans text-sm leading-relaxed font-light text-muted-foreground">
                  {body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 w-full rounded-2xl border border-border/60 bg-card/60 p-8 text-left card-enter-3 sm:p-12">
          <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Start with notes. End with a doc people will actually read.
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed font-light text-muted-foreground sm:text-base">
            Ember is a demo of what you can build on top of @flux-ui/react in a single afternoon —
            file dropzones, stepped wizards, animated pipelines, and a warm-editorial design
            language already wired up.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild className="h-10 gap-2 rounded-full px-6 font-sans text-sm">
              <Link to="/try">
                Try it now
                <ArrowIcon />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-10 rounded-full px-6 font-sans text-sm">
              <Link to="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
