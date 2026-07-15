import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = ResizeObserver as unknown as typeof globalThis.ResizeObserver
}

// jsdom under Vitest 4 exposes a non-functional Storage (opaque origin), so
// provide a minimal in-memory localStorage/sessionStorage implementation.
if (typeof window !== 'undefined' && typeof window.localStorage?.getItem !== 'function') {
  const createStorage = (): Storage => {
    let store: Record<string, string> = {}
    return {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = String(value)
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
      key: (index: number) => Object.keys(store)[index] ?? null,
      get length() {
        return Object.keys(store).length
      },
    } as Storage
  }

  Object.defineProperty(window, 'localStorage', { value: createStorage(), writable: true })
  Object.defineProperty(window, 'sessionStorage', { value: createStorage(), writable: true })
}
