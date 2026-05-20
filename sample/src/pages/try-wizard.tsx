import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import {
  AccentColorPicker,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Callout,
  Card,
  CardContent,
  EitherOrCard,
  FileDropzone,
  PageHeader,
  PipelineProgress,
  SEO,
  SegmentedTabs,
  TextInputCard,
  type AccentColorOption,
  type PipelineStage,
} from '@flux-ui/react'

// ---------------------------------------------------------------------------
// Step machine
// ---------------------------------------------------------------------------

type Step = 'input' | 'audience' | 'style' | 'generating' | 'result'
type InputTab = 'file' | 'text'
type Audience = 'exec-summary' | 'faq' | 'one-pager'

const STAGES: PipelineStage[] = [
  {
    key: 'parse',
    icon: <ScanIcon />,
    title: 'Parse source',
    description: 'Convert your input into a structured outline.',
  },
  {
    key: 'structure',
    icon: <ListIcon />,
    title: 'Identify shape',
    description: 'Tag claims, evidence, asides, and supporting examples.',
  },
  {
    key: 'draft',
    icon: <SparklesIcon />,
    title: 'Draft three openings',
    description: 'Score against the source and pick the strongest.',
  },
  {
    key: 'polish',
    icon: <PenIcon />,
    title: 'Polish prose',
    description: 'Trim weasel words, prefer concrete nouns, balance sentence length.',
  },
]

const ACCENT_COLORS: AccentColorOption[] = [
  { id: 'black', name: 'Classic Black', hex: '#1a1a1a' },
  { id: 'amber', name: 'Warm Amber', hex: '#c2410c' },
  { id: 'forest', name: 'Forest', hex: '#15803d' },
  { id: 'royal', name: 'Royal', hex: '#1d4ed8' },
  { id: 'plum', name: 'Plum', hex: '#7c2d92' },
  { id: 'slate', name: 'Slate', hex: '#475569' },
]

// ---------------------------------------------------------------------------
// Icons (inline so the wizard has zero icon-library dependency)
// ---------------------------------------------------------------------------

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  )
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function TextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  )
}

function ExecIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-5" />
    </svg>
  )
}

function FAQIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12" y2="17" />
    </svg>
  )
}

function OnePagerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Step content
// ---------------------------------------------------------------------------

function InputStep({
  activeTab,
  setActiveTab,
  file,
  setFile,
  text,
  setText,
  onContinue,
}: {
  activeTab: InputTab
  setActiveTab: (next: InputTab) => void
  file: File | null
  setFile: (f: File | null) => void
  text: string
  setText: (t: string) => void
  onContinue: () => void
}) {
  const contentOwner: InputTab | null = file ? 'file' : text.trim() ? 'text' : null

  const handleFileChange = (next: File | null) => {
    if (next && text.trim()) setText('')
    setFile(next)
  }

  const handleTextChange = (value: string) => {
    if (file && !text.trim() && value.trim()) setFile(null)
    setText(value)
  }

  const canProceed = !!(file || text.trim())

  return (
    <>
      <PageHeader
        title="Start with anything"
        size="lg"
        subtitle="Drop a file or paste your notes. Either works."
        description="The wizard below is fully interactive but never sends your input anywhere — everything stays in your browser."
      />

      <div className="mt-10 flex w-full max-w-2xl card-enter-2 flex-col gap-4">
        <SegmentedTabs
          tabs={[
            {
              value: 'file',
              label: 'Upload file',
              icon: <FileIcon />,
              hasData: !!file,
              deemphasized: contentOwner === 'text',
            },
            {
              value: 'text',
              label: 'Paste notes',
              icon: <TextIcon />,
              hasData: !!text.trim(),
              deemphasized: contentOwner === 'file',
            },
          ]}
          value={activeTab}
          onChange={setActiveTab}
        />

        <div className="h-[380px]">
          {activeTab === 'file' ? (
            <FileDropzone
              file={file}
              onFileChange={handleFileChange}
              title="Drop a source document"
              subtitle="PDF, DOC, DOCX, or plain text"
              placeholder="Drop your source here"
              hint="or click to browse files"
              formats={['PDF', 'DOC', 'DOCX', 'TXT']}
              accept={{
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
                  '.docx',
                ],
                'text/plain': ['.txt', '.md'],
              }}
            />
          ) : (
            <TextInputCard
              value={text}
              onChange={handleTextChange}
              title="Paste your notes"
              subtitle="The rougher the better — Ember handles the polish"
              placeholder="Bullet points, stream-of-consciousness, raw research notes, a meeting transcript… anything goes."
              hint="Markdown lists and headings are honored if you have them."
              maxChars={20_000}
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-2xl card-enter-3 justify-center">
        <Button
          disabled={!canProceed}
          onClick={onContinue}
          className="h-11 gap-2 rounded-full px-8 font-sans text-sm font-medium active:scale-[0.97]"
        >
          Continue
          <ArrowIcon />
        </Button>
      </div>
    </>
  )
}

function AudienceStep({
  audience,
  setAudience,
  onBack,
  onContinue,
}: {
  audience: Audience | null
  setAudience: (next: Audience) => void
  onBack: () => void
  onContinue: (audience: Audience, briefing: string) => void
}) {
  return (
    <EitherOrCard
      options={[
        {
          id: 'exec-summary',
          label: 'Executive summary',
          icon: <ExecIcon />,
          placeholder: 'Who is the exec? What decision do they need to make after reading?',
          sectionLabel: '↳ Tell us about your reader',
        },
        {
          id: 'faq',
          label: 'FAQ',
          icon: <FAQIcon />,
          placeholder: 'List the questions your readers ask most often, one per line.',
          sectionLabel: '↳ Questions to address',
        },
        {
          id: 'one-pager',
          label: 'One-pager',
          icon: <OnePagerIcon />,
          placeholder: 'What headline outcome do you want the one-pager to lead with?',
          sectionLabel: '↳ Briefing',
        },
      ]}
      defaultSelectedId={audience ?? 'exec-summary'}
      title="Pick an output format"
      subtitle="Each format keeps the same source content but reframes it for a different audience."
      callout={
        <Callout icon={<TrendingUpIcon />}>
          Documents formatted for the audience are 4× more likely to be read all the way through.
        </Callout>
      }
      maxChars={2000}
      onBack={onBack}
      onContinue={(id, briefing) => {
        setAudience(id)
        onContinue(id, briefing)
      }}
    />
  )
}

function StyleStep({
  accentId,
  setAccentId,
  onBack,
  onContinue,
}: {
  accentId: string
  setAccentId: (next: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  return (
    <div className="w-full max-w-xl">
      <div className="mb-10 flex hero-enter justify-center">
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

      <PageHeader
        title="Pick an accent"
        description="The exported document picks up your accent color for headings, callouts, and the title rule."
      />

      <div className="card-enter-1">
        <AccentColorPicker
          accentColors={ACCENT_COLORS}
          selectedColor={accentId}
          onSelectColor={setAccentId}
        />
      </div>

      <div className="mt-10 flex card-enter-2 justify-center">
        <Button
          onClick={onContinue}
          className="h-11 gap-2 rounded-full px-8 font-sans text-sm font-medium active:scale-[0.97]"
        >
          Generate
          <ArrowIcon />
        </Button>
      </div>
    </div>
  )
}

function GeneratingStep({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(-1)
  const [done, setDone] = useState(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const schedule = (delay: number, fn: () => void) => {
      const id = setTimeout(fn, delay)
      timeoutsRef.current.push(id)
    }
    schedule(700, () => setStepIdx(0))
    schedule(1900, () => setStepIdx(1))
    schedule(3300, () => setStepIdx(2))
    schedule(4900, () => setStepIdx(3))
    schedule(5700, () => setDone(true))

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [])

  return (
    <PipelineProgress
      stages={STAGES}
      done={done}
      currentStepKey={stepIdx >= 0 ? STAGES[stepIdx].key : undefined}
      onComplete={onComplete}
      runningTitle="Drafting…"
      runningSubtitle="Sit tight — this normally takes about three minutes. Demo mode runs faster."
      doneTitle="Draft ready"
      doneSubtitle="Opening your document…"
    />
  )
}

// ---------------------------------------------------------------------------
// Result content (deterministic mock — varies per audience)
// ---------------------------------------------------------------------------

interface MockResult {
  title: string
  preface: ReactNode
  body: ReactNode
  strengths: string[]
  improvements: string[]
}

function buildMockResult(audience: Audience, accentHex: string): MockResult {
  const accentStyle = { color: accentHex, borderColor: `${accentHex}66` }

  switch (audience) {
    case 'exec-summary':
      return {
        title: 'Executive summary',
        preface: 'A 250-word digest tuned for a busy decision-maker.',
        body: (
          <div className="space-y-3">
            <h4 className="font-display text-xl font-semibold" style={{ color: accentHex }}>
              Q4 program review · Recommendation
            </h4>
            <p>
              The migration to the new platform exceeded the goal of 90% feature parity by mid-Q3
              and produced a 32% reduction in page-load latency on the top five customer flows.
              Net new MRR attributable to the rollout was <strong>$612k</strong>, against a forecast of $450k.
            </p>
            <p>
              <strong>Recommendation:</strong> proceed to the deprecation phase in Q1 and re-allocate
              the platform team’s headcount to the new commercial vertical pilot.
            </p>
          </div>
        ),
        strengths: [
          'Concrete dollar figures up front',
          'Single, unambiguous recommendation',
          'No hedging language',
        ],
        improvements: [
          'Could surface the risk to ongoing customer support during deprecation',
        ],
      }
    case 'faq':
      return {
        title: 'FAQ',
        preface: 'Four questions readers ask most often, answered in plain prose.',
        body: (
          <div className="space-y-4">
            <div>
              <h4 className="font-display text-lg font-semibold" style={{ color: accentHex }}>
                What changes for me on day one?
              </h4>
              <p className="mt-1">
                Nothing visible. The migration runs in the background. You’ll receive an email
                confirming once your workspace has been moved over.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg font-semibold" style={{ color: accentHex }}>
                Will my integrations keep working?
              </h4>
              <p className="mt-1">
                Yes. We tested the top 40 integrations end-to-end before the rollout. If you use a
                less common one, the support team has a verified list on the migration FAQ page.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg font-semibold" style={{ color: accentHex }}>
                How do I roll back if something breaks?
              </h4>
              <p className="mt-1">
                Open a support ticket within 7 days. We keep a snapshot of the old workspace state
                for that window and can restore in under 30 minutes.
              </p>
            </div>
          </div>
        ),
        strengths: [
          'Questions match what the customer team actually fielded',
          'Answers stay under 40 words each',
        ],
        improvements: ['One more question on the billing impact would round it out'],
      }
    case 'one-pager':
      return {
        title: 'One-pager',
        preface: 'A printable single-page summary with a headline, three pillars, and a call to action.',
        body: (
          <div className="space-y-4">
            <h4
              className="border-b pb-2 font-display text-2xl font-semibold tracking-tight"
              style={accentStyle}
            >
              Ember Q4 · From idea to draft in three minutes
            </h4>
            <p>
              Teams ship more docs when the polish step is automatic. Ember replaces the
              copy-edit pass that usually eats a Tuesday afternoon with a three-minute pipeline that
              you can rerun anytime.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { h: 'Drop notes in', b: 'Any format. PDFs, Word docs, raw thinking.' },
                { h: 'Pick a shape', b: 'Summary, FAQ, or one-pager — your call.' },
                { h: 'Export & share', b: 'Markdown, DOCX, or PDF, accent-coloured to match.' },
              ].map(({ h, b }) => (
                <div key={h}>
                  <p className="font-display text-base font-semibold" style={{ color: accentHex }}>
                    {h}
                  </p>
                  <p className="mt-1 text-sm">{b}</p>
                </div>
              ))}
            </div>
            <p className="text-sm font-medium" style={{ color: accentHex }}>
              Get started at ember.example · Free for one doc per month.
            </p>
          </div>
        ),
        strengths: [
          'Headline carries a number AND a verb',
          'Three pillars maps to a print-friendly column grid',
        ],
        improvements: ['A footer disclaimer would help if this gets reprinted externally'],
      }
  }
}

function ResultStep({
  audience,
  accentId,
  onRestart,
}: {
  audience: Audience
  accentId: string
  onRestart: () => void
}) {
  const accentHex = useMemo(
    () => ACCENT_COLORS.find((c) => c.id === accentId)?.hex ?? '#1a1a1a',
    [accentId],
  )
  const result = useMemo(() => buildMockResult(audience, accentHex), [audience, accentHex])

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-10 hero-enter text-center">
        <Badge variant="outline" className="mb-4 font-sans uppercase tracking-wider">
          {result.title}
        </Badge>
        <h2 className="font-display text-[3rem] leading-none font-semibold tracking-tight text-foreground md:text-[4rem]">
          Your draft is ready
        </h2>
        <p className="mt-4 font-sans text-sm font-light tracking-[0.06em] text-muted-foreground">
          {result.preface}
        </p>
      </div>

      <Card className="card-enter-1 card-lift">
        <CardContent>
          <div className="space-y-4 font-sans text-sm leading-relaxed text-foreground">
            {result.body}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 card-enter-2">
        <Accordion type="single" collapsible defaultValue="feedback">
          <AccordionItem value="feedback" className="rounded-xl border border-border/60 bg-card px-4 last:border-b">
            <AccordionTrigger className="font-sans text-sm font-medium">
              Self-review notes
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-primary/80">
                    Strengths
                  </p>
                  <ul className="mt-1 space-y-1 font-sans text-sm text-muted-foreground">
                    {result.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Could be sharper
                  </p>
                  <ul className="mt-1 space-y-1 font-sans text-sm text-muted-foreground">
                    {result.improvements.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3 card-enter-3">
        <Button onClick={onRestart} variant="outline" className="h-10 rounded-full px-6 font-sans text-sm">
          Try another input
        </Button>
        <Button asChild className="h-10 gap-2 rounded-full px-6 font-sans text-sm">
          <Link to="/pricing">
            See pricing
            <ArrowIcon />
          </Link>
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Wizard shell
// ---------------------------------------------------------------------------

export function Component() {
  const [step, setStep] = useState<Step>('input')
  const [activeTab, setActiveTab] = useState<InputTab>('file')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [audience, setAudience] = useState<Audience | null>(null)
  const [accentId, setAccentId] = useState<string>('amber')

  const restart = () => {
    setStep('input')
    setFile(null)
    setText('')
    setAudience(null)
  }

  return (
    <>
      <SEO
        title="Try Ember"
        description="Walk through the Ember wizard in your browser. Pick an input, an audience, and an accent; watch the demo pipeline run."
        path="/try"
      />

      {step === 'input' && (
        <InputStep
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          file={file}
          setFile={setFile}
          text={text}
          setText={setText}
          onContinue={() => setStep('audience')}
        />
      )}

      {step === 'audience' && (
        <AudienceStep
          audience={audience}
          setAudience={setAudience}
          onBack={() => setStep('input')}
          onContinue={(picked) => {
            setAudience(picked)
            setStep('style')
          }}
        />
      )}

      {step === 'style' && audience && (
        <StyleStep
          accentId={accentId}
          setAccentId={setAccentId}
          onBack={() => setStep('audience')}
          onContinue={() => setStep('generating')}
        />
      )}

      {step === 'generating' && (
        <GeneratingStep onComplete={() => setStep('result')} />
      )}

      {step === 'result' && audience && (
        <ResultStep audience={audience} accentId={accentId} onRestart={restart} />
      )}
    </>
  )
}
