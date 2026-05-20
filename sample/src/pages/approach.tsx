import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

import { Button, Callout, PageHeader, SEO } from '@flux-ui/react'

interface SectionProps {
  title: string
  children: ReactNode
  callout?: ReactNode
}

function Section({ title, children, callout }: SectionProps) {
  return (
    <div className="py-8 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border/40">
      <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <div className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">{children}</div>
      {callout && <div className="mt-4">{callout}</div>}
    </div>
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

export function Component() {
  return (
    <>
      <SEO
        title="How Ember Works"
        description="Ember turns rough notes into polished writing through a four-stage pipeline: parse, structure, draft, polish."
        path="/approach"
      />

      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <PageHeader
          title="How Ember works"
          description="Four stages from rough notes to a polished document. Each stage is independently inspectable so you keep control."
        />

        <div className="card-enter-1 rounded-2xl border border-border/60 bg-card px-8 py-2">
          <Section
            title="Parse"
            callout={
              <Callout>
                Inputs &gt; 20,000 characters are chunked automatically with overlap so nothing
                falls between the seams.
              </Callout>
            }
          >
            <p>
              We accept PDFs, Word documents, plain text, and pasted snippets. Files are parsed
              into a structured outline — headings, paragraphs, lists, code blocks. The outline is
              what every later stage operates on, never the raw bytes.
            </p>
          </Section>

          <Section title="Structure">
            <p>
              From the outline we infer the document’s shape: claims, evidence, asides, examples.
              Each unit gets tagged so the drafting stage knows what to keep, what to compress, and
              what to drop entirely for a given output format.
            </p>
          </Section>

          <Section
            title="Draft"
            callout={
              <Callout tone="muted">
                You pick the output format. The same source can become an executive summary, an
                FAQ, or a one-pager — each tuned to a different audience and length budget.
              </Callout>
            }
          >
            <p>
              The drafting stage is where the heavy lifting happens. We generate three candidate
              openings, score them against the source material for fidelity, and pick the strongest
              one. The rest of the document follows the chosen opening’s tone.
            </p>
          </Section>

          <Section title="Polish">
            <p>
              Pass over the draft with style rules: trim weasel words, prefer concrete nouns over
              abstract ones, break runs of long sentences. Every edit is traceable to a rule, so
              you can disable any rule you disagree with.
            </p>
          </Section>

          <Section title="Export">
            <p>
              Markdown by default. PDF and DOCX exports include the structural metadata so a
              downstream editor can recover the outline without re-parsing your prose.
            </p>
          </Section>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
          <Button
            asChild
            className="h-11 gap-2 rounded-full px-8 font-sans text-sm font-medium active:scale-[0.97]"
          >
            <Link to="/try">
              Try the four-stage demo
              <ArrowIcon />
            </Link>
          </Button>
          <p className="font-sans text-[11px] tracking-wide text-muted-foreground/50">
            No sign-up · Demo runs without a backend
          </p>
        </div>
      </div>
    </>
  )
}
