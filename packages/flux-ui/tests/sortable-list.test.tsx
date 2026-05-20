import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import { SortableList } from '@/components/sortable-list'

const items = [
  { id: '1', label: 'Alpha' },
  { id: '2', label: 'Bravo' },
  { id: '3', label: 'Charlie' },
]

describe('SortableList', () => {
  it('renders each item via the renderItem prop', () => {
    render(
      <SortableList
        items={items}
        getId={(it) => it.id}
        onReorder={() => {}}
        renderItem={(it, handle) => (
          <div>
            <button {...handle}>drag</button>
            <span>{it.label}</span>
          </div>
        )}
      />,
    )
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Bravo')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    expect(screen.getAllByText('drag')).toHaveLength(3)
  })
})
