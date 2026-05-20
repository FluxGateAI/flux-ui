import { Link } from 'react-router-dom'

import { Card, CardContent, PageHeader } from '@flux-ui/react'

const groups: Array<{ to: string; title: string; description: string }> = [
  {
    to: '/primitives',
    title: 'Primitives',
    description: 'Buttons, cards, inputs, labels, badges, separators, avatars.',
  },
  {
    to: '/layout',
    title: 'Layout',
    description: 'SiteShell, PageHeader, ThemeToggle.',
  },
  {
    to: '/inputs',
    title: 'Inputs',
    description: 'FileDropzone, TextInputCard, SegmentedTabs.',
  },
  {
    to: '/data-entry',
    title: 'Data entry',
    description: 'EitherOrCard, Callout — multi-step forms.',
  },
  {
    to: '/feedback',
    title: 'Feedback & progress',
    description: 'StatCarousel, PipelineProgress.',
  },
  {
    to: '/lists',
    title: 'Lists & pickers',
    description: 'SortableList, AccentColorPicker, MiniatureResumePreview.',
  },
  {
    to: '/overlays',
    title: 'Overlays',
    description: 'Dialog, DropdownMenu, Tabs, Accordion.',
  },
]

export function IndexPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="flux-ui"
        size="lg"
        subtitle="Warm-editorial React components extracted from ResuMaker."
        description="Tailwind v4 · radix-ui · shadcn-style primitives · drag-and-drop · accent themes"
      />
      <div className="card-enter-1 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Link key={g.to} to={g.to}>
            <Card className="card-lift h-full transition-colors hover:border-primary/40">
              <CardContent>
                <p className="font-display text-xl font-semibold tracking-tight">{g.title}</p>
                <p className="mt-2 font-sans text-sm text-muted-foreground">{g.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
