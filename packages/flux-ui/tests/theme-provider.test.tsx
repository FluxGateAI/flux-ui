import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ThemeProvider } from '@/theme/theme-provider'
import { useTheme } from '@/theme/use-theme'

function Probe() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolvedTheme}</span>
      <button onClick={() => setTheme('light')}>set-light</button>
      <button onClick={() => setTheme('system')}>set-system</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

/** jsdom persists cookies across tests in a file — expire every one by name. */
function clearCookies() {
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0]?.trim()
    if (name) document.cookie = `${name}=; max-age=0; path=/`
  }
}

function cookieValue(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    window.localStorage.clear()
    clearCookies()
  })

  it('applies the .dark class for default dark theme', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
  })

  it('falls back to defaultTheme when neither cookie nor localStorage is set', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('toggleTheme flips between light and dark', async () => {
    render(
      <ThemeProvider defaultTheme="light">
        <Probe />
      </ThemeProvider>,
    )
    expect(document.documentElement).not.toHaveClass('dark')
    await userEvent.click(screen.getByText('toggle'))
    expect(document.documentElement).toHaveClass('dark')
  })

  it('persists user selection to both the cookie and localStorage', async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByText('set-light'))
    expect(cookieValue('flux-theme')).toBe('light')
    expect(window.localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('prefers the cookie over a conflicting localStorage value', () => {
    document.cookie = 'flux-theme=light; path=/'
    window.localStorage.setItem('theme', 'dark')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it('migrates a localStorage value to the cookie when no cookie exists', () => {
    window.localStorage.setItem('theme', 'light')
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(cookieValue('flux-theme')).toBe('light')
  })

  it('ignores a cookie holding a value that is not a valid theme', () => {
    document.cookie = 'flux-theme=chartreuse; path=/'
    render(
      <ThemeProvider defaultTheme="light">
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
  })

  it("stores 'system' verbatim rather than its resolved value", async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByText('set-system'))
    expect(cookieValue('flux-theme')).toBe('system')
    expect(window.localStorage.getItem('theme')).toBe('system')
    expect(screen.getByTestId('theme')).toHaveTextContent('system')
  })

  it('uses a custom storageKey', async () => {
    render(
      <ThemeProvider storageKey="my-app-theme">
        <Probe />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByText('set-light'))
    expect(window.localStorage.getItem('my-app-theme')).toBe('light')
  })

  it('uses a custom cookieName', async () => {
    render(
      <ThemeProvider cookieName="my-app-theme">
        <Probe />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByText('set-light'))
    expect(cookieValue('my-app-theme')).toBe('light')
  })

  it('syncs from a storage event fired by another tab', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }))
    })
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('ignores storage events for unrelated keys', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: 'light' }))
    })
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })
})
