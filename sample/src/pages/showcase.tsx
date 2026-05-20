import { useState } from 'react'
import { toast } from 'sonner'

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  MiniatureResumePreview,
  PageHeader,
  SEO,
  SegmentedTabs,
  Separator,
  SortableList,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeToggle,
} from '@flux-ui/react'

interface Section {
  title: string
  description: string
  body: React.ReactNode
}

interface ListItem {
  id: string
  title: string
  subtitle: string
}

const INITIAL_ITEMS: ListItem[] = [
  { id: '1', title: 'Draft the Q4 board update', subtitle: 'Due Friday · Exec summary' },
  { id: '2', title: 'Pricing-page rewrite', subtitle: 'In review · One-pager' },
  { id: '3', title: 'Customer FAQ refresh', subtitle: 'Idea · FAQ' },
]

function GripIcon() {
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
      <circle cx="9" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="18" r="1" />
    </svg>
  )
}

function SortableListSection() {
  const [items, setItems] = useState<ListItem[]>(INITIAL_ITEMS)
  return (
    <SortableList
      items={items}
      getId={(it) => it.id}
      onReorder={(orderedIds) =>
        setItems(orderedIds.map((id) => items.find((it) => it.id === id)!))
      }
      className="flex w-full flex-col gap-2"
      renderItem={(it, handle) => (
        <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3">
          <button
            {...handle}
            aria-label={`Reorder ${it.title}`}
            className="cursor-grab text-muted-foreground transition-colors hover:text-foreground"
          >
            <GripIcon />
          </button>
          <div className="flex-1">
            <p className="font-sans text-sm font-medium text-foreground">{it.title}</p>
            <p className="font-sans text-xs text-muted-foreground">{it.subtitle}</p>
          </div>
          <Badge variant="outline" className="font-sans">
            {it.subtitle.split(' · ').at(-1)}
          </Badge>
        </div>
      )}
    />
  )
}

function DialogSection() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('Ada Lovelace')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Saved changes apply only in this tab — the demo has no backend.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dialog-name">Name</Label>
            <Input id="dialog-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dialog-email">Email</Label>
            <Input id="dialog-email" type="email" placeholder="ada@example.com" />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="font-sans text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
              toast.success(`Saved ${name}`)
            }}
            className="font-sans text-sm"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DropdownSection() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 font-sans text-sm">
          Actions
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
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Document</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast('Opened in editor')}>Open</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast('Duplicated')}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => toast.error('Deleted')}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TabsSection() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p className="font-sans text-sm text-muted-foreground">
          High-level summary. The data dot indicator on inactive tabs (try SegmentedTabs above) is
          a sibling pattern for the mutual-exclusivity flow.
        </p>
      </TabsContent>
      <TabsContent value="details">
        <p className="font-sans text-sm text-muted-foreground">
          Tab panels render only when active. Use them for tabbed forms or sidebar navigation.
        </p>
      </TabsContent>
      <TabsContent value="history">
        <p className="font-sans text-sm text-muted-foreground">
          Audit log, undo stack, version history — all common patterns that fit here.
        </p>
      </TabsContent>
    </Tabs>
  )
}

function SegmentedTabsSection() {
  const [value, setValue] = useState<'all' | 'mine' | 'team'>('all')
  return (
    <div className="w-full">
      <SegmentedTabs
        tabs={[
          { value: 'all', label: 'All' },
          { value: 'mine', label: 'Mine', hasData: true },
          { value: 'team', label: 'Team' },
        ]}
        value={value}
        onChange={setValue}
      />
      <p className="mt-3 text-center font-sans text-xs text-muted-foreground">
        Selected: <span className="text-foreground">{value}</span>
      </p>
    </div>
  )
}

function PrimitivesSection() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="link">Link</Button>
      <Separator orientation="vertical" className="h-9" />
      <Badge>New</Badge>
      <Badge variant="secondary">Beta</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Critical</Badge>
      <Separator orientation="vertical" className="h-9" />
      <Avatar>
        <AvatarFallback>EM</AvatarFallback>
      </Avatar>
      <Avatar className="size-10">
        <AvatarFallback>FL</AvatarFallback>
      </Avatar>
      <Separator orientation="vertical" className="h-9" />
      <ThemeToggle />
    </div>
  )
}

const SECTIONS: Section[] = [
  {
    title: 'Primitives',
    description: 'Buttons, badges, avatars, separators, theme toggle.',
    body: <PrimitivesSection />,
  },
  {
    title: 'Dialog',
    description: 'Modal with built-in close button, focus trap, and ESC handling.',
    body: <DialogSection />,
  },
  {
    title: 'Dropdown menu',
    description: 'Action menu with labels, items, separators, and destructive variant.',
    body: <DropdownSection />,
  },
  {
    title: 'Tabs',
    description: 'Standard tab control. Panels lazy-render on first activation.',
    body: <TabsSection />,
  },
  {
    title: 'Segmented tabs',
    description: 'Pill-style switcher with optional data-dot indicators and soft de-emphasis.',
    body: <SegmentedTabsSection />,
  },
  {
    title: 'Sortable list',
    description: 'Drag-and-drop reorder via @dnd-kit. Spread `handleProps` onto the drag handle.',
    body: <SortableListSection />,
  },
  {
    title: 'Miniature preview',
    description:
      'Scaled-down document mock with a dynamic accent. Use as a thumbnail for any structured document.',
    body: (
      <div className="h-64 w-48 overflow-hidden rounded-lg border border-border/60 shadow-sm">
        <MiniatureResumePreview accentColor="#c2410c" />
      </div>
    ),
  },
  {
    title: 'Toaster',
    description: 'Sonner-powered notifications, pre-wired to the theme tokens.',
    body: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button variant="outline" size="sm" onClick={() => toast('Saved')}>
          Show toast
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success('All set')}>
          Success
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.error('Something broke', { description: 'Retry?' })}
        >
          Error
        </Button>
      </div>
    ),
  },
]

export function Component() {
  return (
    <>
      <SEO
        title="Component showcase"
        description="A live tour of every component in @flux-ui/react that didn't fit into the wizard demo."
        path="/showcase"
      />

      <div className="w-full max-w-4xl px-4 py-12">
        <PageHeader
          title="Component showcase"
          description="Everything in @flux-ui/react that didn't already appear in the wizard demo. Each tile is a working, interactive example."
        />

        <div className="grid card-enter-1 grid-cols-1 gap-4 sm:grid-cols-2">
          {SECTIONS.map((section, i) => (
            <Card key={section.title} className={i % 3 === 0 ? 'sm:col-span-2' : ''}>
              <CardContent>
                <div className="mb-4">
                  <p className="font-display text-xl font-semibold tracking-tight">
                    {section.title}
                  </p>
                  <p className="mt-1 font-sans text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20 p-6">
                  {section.body}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
