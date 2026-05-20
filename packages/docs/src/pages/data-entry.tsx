import { Callout, EitherOrCard } from '@flux-ui/react'

import { Section, Showcase } from './showcase'

export function DataEntryPage() {
  return (
    <Section
      title="Data entry"
      intro="Higher-level patterns layered on the inputs above."
    >
      <Showcase
        title="EitherOrCard"
        description="Pick one of N options, then describe it. Continue button stays disabled until text is present."
        code={`<EitherOrCard
  options={[
    { id: 'job-post', label: 'Job post', placeholder: 'Paste the job description' },
    { id: 'ideal-role', label: 'Ideal role', placeholder: 'Describe your target role' },
  ]}
  title="Target role"
  subtitle="Pick a direction so we can tailor your resume."
  callout={
    <Callout>Tailored resumes get 31% more interview callbacks.</Callout>
  }
  onContinue={(id, text) => console.log(id, text)}
/>`}
      >
        <EitherOrCard
          options={[
            {
              id: 'job-post' as const,
              label: 'Job post',
              placeholder: 'Paste the job description',
              sectionLabel: '↳ Paste the job description',
            },
            {
              id: 'ideal-role' as const,
              label: 'Ideal role',
              placeholder: 'Describe your target role',
              sectionLabel: '↳ Describe your target role',
            },
          ]}
          title="Target role"
          subtitle="Pick a direction."
          callout={<Callout>Tailored resumes get 31% more callbacks.</Callout>}
          onContinue={(id, text) => console.log(id, text)}
        />
      </Showcase>

      <Showcase
        title="Callout"
        code={`<Callout>Primary tone (amber)</Callout>
<Callout tone="destructive">Destructive tone</Callout>
<Callout tone="muted">Muted tone</Callout>`}
      >
        <div className="flex w-full flex-col gap-3">
          <Callout>Primary tone (amber)</Callout>
          <Callout tone="destructive">Destructive tone</Callout>
          <Callout tone="muted">Muted tone</Callout>
        </div>
      </Showcase>
    </Section>
  )
}
