import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

import {
  readThemeCookie,
  writeThemeCookie,
  THEME_BOOTSTRAP_SCRIPT,
} from '@/theme/theme-storage'

/**
 * jsdom's `document.cookie` getter drops attributes, so assertions about
 * `domain=` / `secure` / `max-age` have to observe the raw setter.
 */
function captureCookieWrites() {
  const writes: string[] = []
  const original = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie')
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get: () => '',
    set: (value: string) => {
      writes.push(value)
    },
  })
  return {
    writes,
    restore: () => {
      delete (document as unknown as Record<string, unknown>).cookie
      if (original) Object.defineProperty(Document.prototype, 'cookie', original)
    },
  }
}

describe('readThemeCookie', () => {
  beforeEach(() => {
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0]?.trim()
      if (name) document.cookie = `${name}=; max-age=0; path=/`
    }
  })

  it('reads a valid theme', () => {
    document.cookie = 'flux-theme=light; path=/'
    expect(readThemeCookie('flux-theme')).toBe('light')
  })

  it('returns null for a value that is not a theme', () => {
    document.cookie = 'flux-theme=neon; path=/'
    expect(readThemeCookie('flux-theme')).toBeNull()
  })

  it('returns null when the cookie is absent', () => {
    expect(readThemeCookie('flux-theme')).toBeNull()
  })

  it('does not match a cookie whose name merely ends with the key', () => {
    document.cookie = 'not-flux-theme=light; path=/'
    expect(readThemeCookie('flux-theme')).toBeNull()
  })
})

describe('writeThemeCookie', () => {
  let cookies: ReturnType<typeof captureCookieWrites>

  beforeEach(() => {
    cookies = captureCookieWrites()
  })
  afterEach(() => {
    cookies.restore()
  })

  it('writes the value with path, max-age and samesite', () => {
    writeThemeCookie('flux-theme', 'light')
    expect(cookies.writes[0]).toContain('flux-theme=light')
    expect(cookies.writes[0]).toContain('path=/')
    expect(cookies.writes[0]).toContain('max-age=31536000')
    expect(cookies.writes[0]).toContain('samesite=lax')
  })

  it('includes domain= when a cookieDomain is given', () => {
    writeThemeCookie('flux-theme', 'dark', '.fluxgate.ai')
    expect(cookies.writes[0]).toContain('domain=.fluxgate.ai')
  })

  it('omits domain= when no cookieDomain is given', () => {
    writeThemeCookie('flux-theme', 'dark')
    expect(cookies.writes[0]).not.toContain('domain=')
  })

  it('omits secure on http (jsdom serves http://localhost)', () => {
    writeThemeCookie('flux-theme', 'dark')
    expect(cookies.writes[0]).not.toContain('secure')
  })
})

describe('THEME_BOOTSTRAP_SCRIPT', () => {
  const consumers = {
    'sample/index.html': '../../../sample/index.html',
    'packages/docs/index.html': '../../docs/index.html',
  }

  /** Tolerate the indentation prettier applies inside <script>, not logic drift. */
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()

  it.each(Object.entries(consumers))(
    '%s inlines a copy that has not drifted',
    (_name, relative) => {
      const html = readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8')
      expect(normalize(html)).toContain(normalize(THEME_BOOTSTRAP_SCRIPT))
    },
  )

  it('resolves system through matchMedia rather than treating it as light', () => {
    expect(THEME_BOOTSTRAP_SCRIPT).toContain("matchMedia('(prefers-color-scheme: dark)')")
  })

  it('reads the cookie before falling back to localStorage', () => {
    expect(THEME_BOOTSTRAP_SCRIPT.indexOf('document.cookie')).toBeLessThan(
      THEME_BOOTSTRAP_SCRIPT.indexOf('localStorage'),
    )
  })
})
