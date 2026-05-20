import { useState } from 'react'

import { FileDropzone, SegmentedTabs, TextInputCard } from '@flux-ui/react'

import { Section, Showcase } from './showcase'

export function InputsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [tab, setTab] = useState<'a' | 'b'>('a')

  return (
    <Section title="Inputs" intro="Drag-and-drop file picker, long-form text card, segmented switcher.">
      <Showcase
        title="FileDropzone"
        description="Accepts PDF/DOC/DOCX by default. Pass `accept`/`formats`/`title` to customise."
        code={`<FileDropzone file={file} onFileChange={setFile} />`}
      >
        <div className="h-[380px] w-[420px]">
          <FileDropzone file={file} onFileChange={setFile} />
        </div>
      </Showcase>

      <Showcase
        title="TextInputCard"
        description="Auto word + character counter; warns at 90% of `maxChars` and errors at 100%."
        code={`<TextInputCard
  value={text}
  onChange={setText}
  maxChars={1500}
  title="Notes"
  subtitle="Anything goes"
  placeholder="Start typing…"
/>`}
      >
        <div className="h-[260px] w-[420px]">
          <TextInputCard
            value={text}
            onChange={setText}
            maxChars={1500}
            title="Notes"
            subtitle="Anything goes"
            placeholder="Start typing…"
          />
        </div>
      </Showcase>

      <Showcase
        title="SegmentedTabs"
        description="Pill-style switcher with optional 'data dot' indicators and a soft-deemphasis state."
        code={`<SegmentedTabs
  tabs={[
    { value: 'a', label: 'Upload' },
    { value: 'b', label: 'Paste text' },
  ]}
  value={tab}
  onChange={setTab}
/>`}
      >
        <div className="w-[420px]">
          <SegmentedTabs
            tabs={[
              { value: 'a' as const, label: 'Upload' },
              { value: 'b' as const, label: 'Paste text' },
            ]}
            value={tab}
            onChange={setTab}
          />
          <p className="mt-3 text-center text-sm text-muted-foreground">Selected: {tab}</p>
        </div>
      </Showcase>
    </Section>
  )
}
