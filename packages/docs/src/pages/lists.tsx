import { useState } from 'react'

import {
  AccentColorPicker,
  type AccentColorOption,
  MiniatureResumePreview,
  SortableList,
} from '@flux-ui/react'

import { Section, Showcase } from './showcase'

const COLORS: AccentColorOption[] = [
  { id: 'black', name: 'Classic Black', hex: '#1a1a1a' },
  { id: 'amber', name: 'Warm Amber', hex: '#c2410c' },
  { id: 'forest', name: 'Forest', hex: '#15803d' },
  { id: 'royal', name: 'Royal', hex: '#1d4ed8' },
  { id: 'plum', name: 'Plum', hex: '#7c2d92' },
  { id: 'slate', name: 'Slate', hex: '#475569' },
]

interface ListRow {
  id: string
  label: string
}

const INITIAL_ROWS: ListRow[] = [
  { id: 'a', label: 'Front-end Engineer · Acme · 2022 – Present' },
  { id: 'b', label: 'Software Engineer · DataCorp · 2018 – 2022' },
  { id: 'c', label: 'Junior Developer · WebShop · 2015 – 2018' },
]

export function ListsPage() {
  const [rows, setRows] = useState<ListRow[]>(INITIAL_ROWS)
  const [selectedColor, setSelectedColor] = useState('amber')

  return (
    <Section title="Lists & pickers" intro="Reorder lists, pick accent colors, preview mini resumes.">
      <Showcase
        title="SortableList"
        description="Tiny wrapper over @dnd-kit. Spread `handleProps` onto the drag handle."
        code={`<SortableList
  items={rows}
  getId={(it) => it.id}
  onReorder={(orderedIds) => setRows(reorder(rows, orderedIds))}
  renderItem={(it, handle) => (
    <Card>
      <div className="flex items-center gap-3 px-4 py-3">
        <button {...handle} className="cursor-grab">⋮⋮</button>
        <span>{it.label}</span>
      </div>
    </Card>
  )}
/>`}
      >
        <SortableList
          items={rows}
          getId={(it) => it.id}
          onReorder={(orderedIds) =>
            setRows(orderedIds.map((id) => rows.find((r) => r.id === id)!))
          }
          className="flex w-full flex-col gap-2"
          renderItem={(it, handle) => (
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3">
              <button {...handle} className="cursor-grab font-mono text-muted-foreground">
                ⋮⋮
              </button>
              <span className="font-sans text-sm">{it.label}</span>
            </div>
          )}
        />
      </Showcase>

      <Showcase
        title="AccentColorPicker"
        description="Color swatches above a live MiniatureResumePreview thumbnail. Swap the preview by passing `preview`."
        code={`<AccentColorPicker
  accentColors={COLORS}
  selectedColor={selected}
  onSelectColor={setSelected}
/>`}
      >
        <AccentColorPicker
          accentColors={COLORS}
          selectedColor={selectedColor}
          onSelectColor={setSelectedColor}
        />
      </Showcase>

      <Showcase
        title="MiniatureResumePreview"
        description="Standalone — useful in marketing pages as a generic 'document preview' visual."
        code={`<MiniatureResumePreview accentColor="#c2410c" />`}
      >
        <div className="h-64 w-48 overflow-hidden rounded-lg border border-border/60 shadow-sm">
          <MiniatureResumePreview accentColor="#c2410c" />
        </div>
      </Showcase>
    </Section>
  )
}
