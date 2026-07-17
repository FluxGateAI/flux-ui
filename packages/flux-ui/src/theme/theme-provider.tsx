import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { ThemeContext, type ResolvedTheme, type Theme } from './theme-context'
import { readThemeCookie, writeThemeCookie, THEME_COOKIE_NAME } from './theme-storage'

interface ThemeProviderProps {
  children: ReactNode
  /** Initial theme when no value is persisted yet. Defaults to 'dark'. */
  defaultTheme?: Theme
  /**
   * localStorage key. Defaults to 'theme'. The cookie is the source of truth;
   * this key is still read once to migrate pre-cookie users, still written on
   * every change, and drives cross-tab sync via the `storage` event.
   */
  storageKey?: string
  /** Cookie name. Defaults to 'flux-theme'. */
  cookieName?: string
  /**
   * Cookie domain, e.g. '.fluxgate.ai', to share the theme across subdomains.
   * Omit for a host-only cookie.
   */
  cookieDomain?: string
}

function readLocalStorage(storageKey: string): Theme | null {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return null
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
  cookieName = THEME_COOKIE_NAME,
  cookieDomain,
}: ThemeProviderProps) {
  // Read order: cookie → localStorage (one-time migration) → defaultTheme.
  const [theme, setThemeState] = useState<Theme>(() => {
    const fromCookie = readThemeCookie(cookieName)
    if (fromCookie) return fromCookie
    const fromStorage = readLocalStorage(storageKey)
    if (fromStorage) {
      writeThemeCookie(cookieName, fromStorage, cookieDomain)
      return fromStorage
    }
    return defaultTheme
  })
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

  // Cookies emit no change event, so cross-tab sync rides on the localStorage
  // mirror written by setTheme.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return
      const next = e.newValue
      if (next === 'light' || next === 'dark' || next === 'system') setThemeState(next)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [storageKey])

  const setTheme = useCallback(
    (next: Theme) => {
      setThemeState(next)
      // 'system' is stored verbatim — resolving it here would freeze the
      // user's "follow my OS" choice into whatever it meant on this site.
      writeThemeCookie(cookieName, next, cookieDomain)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, next)
      }
    },
    [storageKey, cookieName, cookieDomain],
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
