/**
 * Reusable drag-and-drop sortable list built on @dnd-kit.
 *
 * Callers pass the items, an id extractor, a reorder callback, and a render
 * prop. The render prop receives the item plus `handleProps` — spread those
 * onto whichever element should act as the drag handle (typically a small
 * grip button at the top-left of the row).
 *
 * The reorder callback fires once per drop and receives the new total
 * ordering of ids. Callers should optimistically update their local view,
 * then reconcile with the server.
 */
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

/**
 * Props forwarded from `useSortable` that should be spread onto the drag
 * handle element (usually a button). Kept as a structural type so callers
 * don't need to import dnd-kit types.
 */
export type DragHandleProps = Pick<HTMLAttributes<HTMLElement>, 'onPointerDown' | 'onKeyDown'> & {
  ref: (el: HTMLElement | null) => void
  'aria-describedby'?: string
  'aria-pressed'?: boolean
  'aria-roledescription'?: string
  role?: string
  tabIndex?: number
}

interface SortableListProps<T> {
  items: T[]
  getId: (item: T) => string
  onReorder: (orderedIds: string[]) => void
  renderItem: (item: T, handleProps: DragHandleProps) => ReactNode
  /** Optional className applied to the outer list wrapper. */
  className?: string
}

interface SortableRowProps<T> {
  item: T
  id: string
  renderItem: (item: T, handleProps: DragHandleProps) => ReactNode
}

function SortableRow<T>({ item, id, renderItem }: SortableRowProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: 'relative',
  }

  const handleProps: DragHandleProps = {
    ref: setActivatorNodeRef,
    ...attributes,
    ...listeners,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, handleProps)}
    </div>
  )
}

export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  className,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const ids = items.map(getId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = ids.indexOf(String(active.id))
    const newIndex = ids.indexOf(String(over.id))
    if (oldIndex < 0 || newIndex < 0) return
    const next = [...ids]
    const [moved] = next.splice(oldIndex, 1)
    next.splice(newIndex, 0, moved)
    onReorder(next)
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item) => (
            <SortableRow key={getId(item)} id={getId(item)} item={item} renderItem={renderItem} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
