import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { ThemeContext, type ResolvedTheme, type Theme } from './theme-context'

interface ThemeProviderProps {
  children: ReactNode
  /** Initial theme when no value is persisted yet. Defaults to 'dark'. */
  defaultTheme?: Theme
  /** localStorage key. Defaults to 'theme'. */
  storageKey?: string
}

function readStored(storageKey: string, fallback: Theme): Theme {
  if (typeof window === 'undefined') return fallback
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return fallback
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyClass(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStored(storageKey, defaultTheme))
  const [systemDark, setSystemDark] = useState<boolean>(() => systemPrefersDark())

  // Track system preference changes only while `theme === 'system'`.
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const resolvedTheme: ResolvedTheme =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    applyClass(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, next)
      }
    },
    [storageKey],
  )

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
