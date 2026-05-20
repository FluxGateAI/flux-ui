import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatRelativeTime, wordCount } from '@/lib/format'

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "" for missing/invalid inputs', () => {
    expect(formatRelativeTime(null)).toBe('')
    expect(formatRelativeTime(undefined)).toBe('')
    expect(formatRelativeTime('')).toBe('')
    expect(formatRelativeTime('not a date')).toBe('')
  })

  it('formats recent times', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'))

    expect(formatRelativeTime('2026-05-20T11:59:30Z')).toBe('just now')
    expect(formatRelativeTime('2026-05-20T11:55:00Z')).toBe('5m ago')
    expect(formatRelativeTime('2026-05-20T10:00:00Z')).toBe('2h ago')
    expect(formatRelativeTime('2026-05-17T12:00:00Z')).toBe('3d ago')
  })

  it('falls back to short absolute dates for old timestamps', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'))
    const result = formatRelativeTime('2024-01-15T12:00:00Z')
    expect(result).toMatch(/Jan/)
    expect(result).toMatch(/2024/)
  })
})

describe('wordCount', () => {
  it('returns 0 for empty / whitespace strings', () => {
    expect(wordCount('')).toBe(0)
    expect(wordCount('   ')).toBe(0)
  })

  it('counts whitespace-separated tokens', () => {
    expect(wordCount('one')).toBe(1)
    expect(wordCount('one two three')).toBe(3)
    expect(wordCount('  one   two   ')).toBe(2)
  })
})
