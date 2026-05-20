import { useEffect, useState } from 'react'

import { Button, PipelineProgress, StatCarousel } from '@flux-ui/react'

import { Section, Showcase } from './showcase'

const SAMPLE_STATS = [
  { value: '2×', label: 'faster than the previous design' },
  { value: '31%', label: 'lift in conversion vs control', source: 'Internal data' },
  { value: '54%', label: 'of users said this felt better than the old flow' },
]

const STAGES = [
  { key: 'parse', icon: <span>🛰️</span>, title: 'Parsing', description: 'Reading your input.' },
  { key: 'analyze', icon: <span>⚡</span>, title: 'Analyzing', description: 'Comparing fit.' },
  { key: 'render', icon: <span>📄</span>, title: 'Rendering', description: 'Putting it together.' },
]

export function FeedbackPage() {
  const [stepIdx, setStepIdx] = useState(-1)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const t = setTimeout(() => {
      if (stepIdx < STAGES.length - 1) setStepIdx(stepIdx + 1)
      else setDone(true)
    }, 1500)
    return () => clearTimeout(t)
  }, [stepIdx, done])

  const reset = () => {
    setStepIdx(-1)
    setDone(false)
  }

  return (
    <Section
      title="Feedback & progress"
      intro="Surface progress, social proof, and rotation patterns."
    >
      <Showcase
        title="StatCarousel"
        description="Auto-rotates every 4.5s; users can also click dots."
        code={`<StatCarousel stats={[
  { value: '2×', label: 'faster than the previous design' },
  { value: '31%', label: 'lift in conversion vs control' },
]} />`}
      >
        <StatCarousel stats={SAMPLE_STATS} />
      </Showcase>

      <Showcase
        title="PipelineProgress"
        description="Drive it with your backend's SSE 'step' events. When `done` flips to true, `onComplete` fires after `holdMs`."
        code={`<PipelineProgress
  stages={stages}
  currentStepKey={currentStepKey}
  done={done}
  onComplete={() => setStep('result')}
/>`}
      >
        <div className="flex w-full flex-col items-center gap-4">
          <PipelineProgress
            stages={STAGES}
            currentStepKey={stepIdx >= 0 ? STAGES[stepIdx].key : undefined}
            done={done}
            onComplete={() => undefined}
            runningTitle="Demoing…"
            runningSubtitle="Auto-advancing every 1.5s."
            doneTitle="Done."
            doneSubtitle="Click reset to replay."
          />
          <Button variant="outline" size="sm" onClick={reset}>
            Reset
          </Button>
        </div>
      </Showcase>
    </Section>
  )
}
