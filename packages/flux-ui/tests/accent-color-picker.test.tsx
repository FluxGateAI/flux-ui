import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { AccentColorPicker } from '@/components/accent-color-picker'
import { MiniatureResumePreview } from '@/components/miniature-resume-preview'

const colors = [
  { id: 'black', name: 'Black', hex: '#1a1a1a' },
  { id: 'amber', name: 'Amber', hex: '#d97706' },
  { id: 'green', name: 'Green', hex: '#16a34a' },
]

describe('AccentColorPicker', () => {
  it('renders one swatch per color and the active one is aria-pressed', () => {
    render(<AccentColorPicker accentColors={colors} selectedColor="amber" onSelectColor={() => {}} />)
    const swatches = screen.getAllByRole('button')
    expect(swatches).toHaveLength(colors.length)
    expect(swatches[1]).toHaveAttribute('aria-pressed', 'true')
    expect(swatches[0]).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onSelectColor when a swatch is clicked', async () => {
    const onSelectColor = vi.fn()
    render(<AccentColorPicker accentColors={colors} selectedColor="black" onSelectColor={onSelectColor} />)
    const swatches = screen.getAllByRole('button')
    await userEvent.click(swatches[2])
    expect(onSelectColor).toHaveBeenCalledWith('green')
  })

  it('accepts a custom preview renderer', () => {
    render(
      <AccentColorPicker
        accentColors={colors}
        selectedColor="amber"
        onSelectColor={() => {}}
        preview={(hex) => <div data-testid="custom-preview">{hex}</div>}
      />,
    )
    expect(screen.getByTestId('custom-preview')).toHaveTextContent('#d97706')
  })
})

describe('MiniatureResumePreview', () => {
  it('renders default sample content when no data is given', () => {
    render(<MiniatureResumePreview accentColor="#d97706" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText(/Senior Software Engineer/)).toBeInTheDocument()
  })

  it('accepts custom data', () => {
    render(
      <MiniatureResumePreview
        accentColor="#000"
        data={{
          name: 'Jane Smith',
          email: 'j@example.com',
          phone: '555-1212',
          location: 'NYC',
          experience: [{ title: 'PM', company: 'Globex', range: '2020 – 2024' }],
        }}
      />,
    )
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('PM')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
  })
})
