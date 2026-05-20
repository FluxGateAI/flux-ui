import { useCallback, type ReactNode } from 'react'
import { useDropzone, type Accept } from 'react-dropzone'

import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { cn } from '../lib/cn'

interface FileDropzoneProps {
  file: File | null
  onFileChange: (file: File | null) => void
  /** Card header title. Defaults to "Import file". */
  title?: string
  /** Card header subtitle. Defaults to "Upload your file". */
  subtitle?: string
  /** Dropzone-area headline when no file is selected. */
  placeholder?: string
  /** Caption shown below the placeholder. */
  hint?: string
  /** Accepted MIME types / extensions. Defaults to PDF + Word documents. */
  accept?: Accept
  /** Short uppercase labels shown as chips ("PDF", "DOC"). */
  formats?: string[]
  /** Maximum number of files. Defaults to 1. */
  maxFiles?: number
  /** Optional footer slot rendered under the dropzone (e.g. a link). */
  footer?: ReactNode
  className?: string
}

const DEFAULT_ACCEPT: Accept = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

function UploadIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

function FileCheckIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

export function FileDropzone({
  file,
  onFileChange,
  title = 'Import file',
  subtitle = 'Upload an existing document',
  placeholder = 'Drop your file here',
  hint = 'or click to browse',
  accept = DEFAULT_ACCEPT,
  formats = ['PDF', 'DOC', 'DOCX'],
  maxFiles = 1,
  footer,
  className,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0])
      }
    },
    [onFileChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  })

  return (
    <Card className={cn('card-lift h-full overflow-hidden border-border/80', className)}>
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
          <FileIcon />
        </div>
        <div>
          <p className="font-sans text-sm font-medium text-foreground">{title}</p>
          <p className="font-sans text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <CardContent className="p-5">
        <div
          {...getRootProps()}
          className={cn(
            'flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-all duration-200',
            isDragActive
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-border/60 text-muted-foreground hover:border-primary/40 hover:bg-primary/3 hover:text-foreground',
          )}
        >
          <input {...getInputProps()} />

          {file ? (
            <div className="flex flex-col items-center text-center">
              <span className="mb-3 text-primary">
                <FileCheckIcon />
              </span>
              <p className="font-sans text-sm font-medium text-foreground">{file.name}</p>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 h-7 rounded-md border-border/70 font-sans text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  onFileChange(null)
                }}
              >
                Remove file
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="mb-3 transition-transform duration-200 group-hover:scale-105">
                <UploadIcon />
              </span>
              <p className="font-sans text-sm font-medium">
                {isDragActive ? 'Drop to import' : placeholder}
              </p>
              <p className="mt-1 font-sans text-xs opacity-60">{hint}</p>
              {formats.length > 0 && (
                <div className="mt-4 flex gap-1.5">
                  {formats.map((fmt) => (
                    <span
                      key={fmt}
                      className="rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 font-sans text-[10px] tracking-wide text-muted-foreground"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {footer}
      </CardContent>
    </Card>
  )
}
