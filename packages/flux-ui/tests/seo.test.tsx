import { describe, it, expect, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'

import { SEO, SeoProvider } from '@/components/seo'

function renderWithProviders(title: string, props: Partial<Parameters<typeof SEO>[0]> = {}) {
  return render(
    <HelmetProvider>
      <SeoProvider siteName="Acme" baseUrl="https://acme.test" defaultDescription="ACME desc">
        <SEO title={title} {...props} />
      </SeoProvider>
    </HelmetProvider>,
  )
}

describe('SEO', () => {
  beforeEach(() => {
    document.title = ''
    // Helmet writes to <head>; previous tests may have left entries behind that
    // confuse react-helmet-async's reconciler. Clear before each test.
    document.head.querySelectorAll('meta, link').forEach((node) => node.remove())
  })

  it('sets title with the site name appended', async () => {
    renderWithProviders('Pricing', { path: '/pricing' })
    await waitFor(() => expect(document.title).toBe('Pricing — Acme'))
  })

  it('sets canonical link to baseUrl + path', async () => {
    renderWithProviders('Pricing', { path: '/pricing' })
    await waitFor(() => {
      const canonical = document.head.querySelector('link[rel="canonical"]')
      expect(canonical?.getAttribute('href')).toBe('https://acme.test/pricing')
    })
  })

  it('rawTitle skips the site-name suffix', async () => {
    renderWithProviders('Standalone', { rawTitle: true })
    await waitFor(() => expect(document.title).toBe('Standalone'))
  })

  it('throws a helpful error when used without SeoProvider', () => {
    expect(() =>
      render(
        <HelmetProvider>
          <SEO title="x" />
        </HelmetProvider>,
      ),
    ).toThrow(/SeoProvider/)
  })
})
