import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    window.localStorage.clear()
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

  it('persists user selection to localStorage', async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByText('set-light'))
    expect(window.localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement).not.toHaveClass('dark')
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

  it('uses a custom storageKey', async () => {
    render(
      <ThemeProvider storageKey="my-app-theme">
        <Probe />
      </ThemeProvider>,
    )
    await userEvent.click(screen.getByText('set-light'))
    expect(window.localStorage.getItem('my-app-theme')).toBe('light')
  })
})
