import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/cn'

describe('cn', () => {
  it('joins falsey + truthy class values', () => {
    expect(cn('a', false, undefined, 'b', null, 'c')).toBe('a b c')
  })

  it('merges conflicting tailwind utilities, last one wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('text-sm font-medium', 'text-lg')).toBe('font-medium text-lg')
  })

  it('handles class object syntax via clsx', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })
})
