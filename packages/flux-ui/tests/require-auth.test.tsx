import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { RequireAuth } from '@/components/require-auth'

describe('RequireAuth', () => {
  it('renders children when enabled=false (auth disabled)', () => {
    render(
      <RequireAuth enabled={false} isLoaded={false} isSignedIn={false} redirect={() => {}}>
        <p>secret</p>
      </RequireAuth>,
    )
    expect(screen.getByText('secret')).toBeInTheDocument()
  })

  it('renders children when signed in', () => {
    render(
      <RequireAuth isLoaded isSignedIn redirect={() => {}}>
        <p>secret</p>
      </RequireAuth>,
    )
    expect(screen.getByText('secret')).toBeInTheDocument()
  })

  it('calls redirect when not signed in and isLoaded', () => {
    const redirect = vi.fn()
    render(
      <RequireAuth isLoaded isSignedIn={false} redirect={redirect}>
        <p>secret</p>
      </RequireAuth>,
    )
    expect(redirect).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('secret')).not.toBeInTheDocument()
  })

  it('renders fallback while not loaded', () => {
    render(
      <RequireAuth isLoaded={false} isSignedIn={false} redirect={() => {}} fallback={<p>wait</p>}>
        <p>secret</p>
      </RequireAuth>,
    )
    expect(screen.getByText('wait')).toBeInTheDocument()
    expect(screen.queryByText('secret')).not.toBeInTheDocument()
  })
})
