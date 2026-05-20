import { createContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export interface ThemeContextValue {
  /** The user-selected theme — may be 'system'. */
  theme: Theme
  /** Always 'light' or 'dark'; 'system' is resolved against matchMedia. */
  resolvedTheme: ResolvedTheme
  setTheme: (next: Theme) => void
  /** Toggle between light and dark. If currently 'system', flips to the opposite of resolvedTheme. */
  toggleTheme: () => void
}

const noopContext: ThemeContextValue = {
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextValue>(noopContext)
