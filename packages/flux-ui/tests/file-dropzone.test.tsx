import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileDropzone } from '@/components/file-dropzone'

describe('FileDropzone', () => {
  it('shows the empty-state placeholder and format chips', () => {
    render(<FileDropzone file={null} onFileChange={() => {}} formats={['PDF', 'TXT']} />)
    expect(screen.getByText('Drop your file here')).toBeInTheDocument()
    expect(screen.getByText('PDF')).toBeInTheDocument()
    expect(screen.getByText('TXT')).toBeInTheDocument()
  })

  it('shows file metadata and a remove button when a file is selected', async () => {
    const onFileChange = vi.fn()
    const file = new File(['hello world'], 'resume.pdf', { type: 'application/pdf' })
    render(<FileDropzone file={file} onFileChange={onFileChange} />)
    expect(screen.getByText('resume.pdf')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remove file' }))
    expect(onFileChange).toHaveBeenCalledWith(null)
  })

  it('renders a custom footer when provided', () => {
    render(
      <FileDropzone file={null} onFileChange={() => {}} footer={<a href="/help">Need help?</a>} />,
    )
    expect(screen.getByRole('link', { name: 'Need help?' })).toBeInTheDocument()
  })
})
