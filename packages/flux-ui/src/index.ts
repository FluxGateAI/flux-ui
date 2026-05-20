// ── Utilities ──────────────────────────────────────────────────────────────
export { cn } from './lib/cn'
export { formatRelativeTime, wordCount } from './lib/format'

// ── Theme ──────────────────────────────────────────────────────────────────
export { ThemeProvider } from './theme/theme-provider'
export { ThemeContext } from './theme/theme-context'
export type { Theme, ResolvedTheme } from './theme/theme-context'
export { useTheme } from './theme/use-theme'

// ── Primitives (shadcn-style) ──────────────────────────────────────────────
export { Button, buttonVariants } from './components/ui/button'
export type { ButtonProps } from './components/ui/button'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './components/ui/card'
export { Textarea } from './components/ui/textarea'
export { Input } from './components/ui/input'
export { Label } from './components/ui/label'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './components/ui/dialog'
export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './components/ui/dropdown-menu'
export { Separator } from './components/ui/separator'
export { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar'
export { Badge, badgeVariants } from './components/ui/badge'
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/ui/accordion'
export { Toaster } from './components/ui/sonner'

// ── Layout ─────────────────────────────────────────────────────────────────
export { SiteShell, ThemeToggle } from './components/site-shell'
export type { SiteShellProps, BrandConfig, NavLink } from './components/site-shell'
export { PageHeader } from './components/page-header'
export { SeoProvider, SEO } from './components/seo'
export { RequireAuth } from './components/require-auth'

// ── Inputs / data entry ────────────────────────────────────────────────────
export { FileDropzone } from './components/file-dropzone'
export { TextInputCard } from './components/text-input-card'
export { SegmentedTabs } from './components/segmented-tabs'
export type { SegmentedTab } from './components/segmented-tabs'
export { EitherOrCard, Callout } from './components/either-or-card'
export type { EitherOrOption } from './components/either-or-card'

// ── Feedback / progress ────────────────────────────────────────────────────
export { StatCarousel } from './components/stat-carousel'
export type { Stat } from './components/stat-carousel'
export { PipelineProgress } from './components/pipeline-progress'
export type { PipelineStage, PipelineProgressProps } from './components/pipeline-progress'

// ── Lists / pickers ────────────────────────────────────────────────────────
export { SortableList } from './components/sortable-list'
export type { DragHandleProps } from './components/sortable-list'
export { AccentColorPicker } from './components/accent-color-picker'
export type { AccentColorOption } from './components/accent-color-picker'
export {
  MiniatureResumePreview,
} from './components/miniature-resume-preview'
export type {
  MiniatureResumeData,
  MiniatureResumePreviewProps,
} from './components/miniature-resume-preview'
