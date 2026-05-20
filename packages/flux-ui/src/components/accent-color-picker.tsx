import type { ReactNode } from 'react'

import { cn } from '../lib/cn'
import { MiniatureResumePreview, type MiniatureResumeData } from './miniature-resume-preview'

export interface AccentColorOption {
  id: string
  name: string
  hex: string
}

interface AccentColorPickerProps {
  accentColors: AccentColorOption[]
  selectedColor: string
  onSelectColor: (id: string) => void
  /** Optional override of the preview thumbnail. Defaults to <MiniatureResumePreview>. */
  preview?: (hex: string) => ReactNode
  /** Sample resume data forwarded to the default preview. */
  previewData?: MiniatureResumeData
  /** Label rendered above the swatches. */
  label?: string
  className?: string
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function AccentColorPicker({
  accentColors,
  selectedColor,
  onSelectColor,
  preview,
  previewData,
  label = 'Accent color',
  className,
}: AccentColorPickerProps) {
  const activeColorHex = accentColors.find((c) => c.id === selectedColor)?.hex ?? '#1a1a1a'
  const renderPreview = preview ?? ((hex: string) => (
    <MiniatureResumePreview accentColor={hex} data={previewData} />
  ))

  return (
    <div className={cn('space-y-5', className)}>
      <div className="mx-auto h-64 w-48 overflow-hidden rounded-lg border border-border/60 shadow-sm">
        {renderPreview(activeColorHex)}
      </div>

      <div>
        <p className="mb-3 text-center font-sans text-sm font-medium text-foreground">{label}</p>
        <div className="flex justify-center gap-3">
          {accentColors.map((color) => {
            const isSelected = color.id === selectedColor
            return (
              <button
                key={color.id}
                onClick={() => onSelectColor(color.id)}
                title={color.name}
                aria-pressed={isSelected}
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                  isSelected ? 'scale-110 border-primary' : 'border-transparent hover:scale-105',
                )}
              >
                <span className="h-6 w-6 rounded-full" style={{ backgroundColor: color.hex }} />
                {isSelected && (
                  <span className="absolute inset-0 flex items-center justify-center text-white drop-shadow-sm">
                    <CheckIcon />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
