import type { Theme } from './theme-context'

/** Default cookie name. Must match across every property that shares a theme. */
export const THEME_COOKIE_NAME = 'flux-theme'

/** One year, in seconds. */
const MAX_AGE = 31536000

function isTheme(value: string): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

/**
 * Read the persisted theme from `document.cookie`.
 * Returns null when absent, unparseable, or not one of the three valid themes.
 */
export function readThemeCookie(name: string): Theme | null {
  if (typeof document === 'undefined') return null
  for (const part of document.cookie.split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    if (part.slice(0, eq).trim() !== name) continue
    const value = decodeURIComponent(part.slice(eq + 1).trim())
    return isTheme(value) ? value : null
  }
  return null
}

/**
 * Persist the theme to a cookie.
 *
 * Pass `domain` (e.g. `.fluxgate.ai`) to share the choice across subdomains.
 * Omit it for a host-only cookie — the default, and what you want on
 * localhost or a single-origin deployment.
 */
export function writeThemeCookie(name: string, value: Theme, domain?: string): void {
  if (typeof document === 'undefined') return
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    'path=/',
    `max-age=${MAX_AGE}`,
    'samesite=lax',
  ]
  if (domain) attrs.push(`domain=${domain}`)
  if (typeof location !== 'undefined' && location.protocol === 'https:') attrs.push('secure')
  document.cookie = attrs.join('; ')
}

/**
 * Blocking `<head>` script that applies the `.dark` class before first paint.
 *
 * This CANNOT be imported into an `index.html` — it has to run before the
 * bundle loads, so consumers paste the body inline into a `<script>` tag.
 * The export exists so there's one canonical copy to paste from, and so
 * tests can assert the pasted copies haven't drifted.
 */
export const THEME_BOOTSTRAP_SCRIPT = `;(function () {
  var m = document.cookie.match(/(?:^|;\\s*)flux-theme=([^;]*)/)
  var t = m ? decodeURIComponent(m[1]) : null
  if (t !== 'light' && t !== 'dark' && t !== 'system') {
    try {
      t = localStorage.getItem('theme')
    } catch (e) {
      t = null
    }
  }
  if (t !== 'light' && t !== 'dark' && t !== 'system') t = 'dark'
  var dark = t === 'system' ? matchMedia('(prefers-color-scheme: dark)').matches : t === 'dark'
  if (dark) document.documentElement.classList.add('dark')
})()`
