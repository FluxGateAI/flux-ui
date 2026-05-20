import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'

interface SeoSiteConfig {
  /** Site/product name appended to titles (e.g. "Page Title — SiteName"). */
  siteName: string
  /** Canonical origin, e.g. "https://example.com" — no trailing slash. */
  baseUrl: string
  /** Fallback meta description. */
  defaultDescription?: string
  /** Fallback Open Graph image URL (absolute). */
  defaultImage?: string
  /** Twitter card variant. */
  twitterCard?: 'summary' | 'summary_large_image'
}

const SeoContext = createContext<SeoSiteConfig | null>(null)

export function SeoProvider({ children, ...config }: SeoSiteConfig & { children: ReactNode }) {
  const value = useMemo(() => config, [config])
  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>
}

interface SEOProps {
  /** Page title. Appended with " — {siteName}" unless `rawTitle` is true. */
  title: string
  rawTitle?: boolean
  description?: string
  /** Canonical path, e.g. "/pricing" — baseUrl is prepended. */
  path?: string
  image?: string
  ogType?: string
  noIndex?: boolean
}

export function SEO({
  title,
  rawTitle = false,
  description,
  path = '/',
  image,
  ogType = 'website',
  noIndex = false,
}: SEOProps) {
  const config = useContext(SeoContext)
  if (!config) {
    throw new Error('SEO must be rendered inside a <SeoProvider>.')
  }

  const fullTitle = rawTitle ? title : `${title} — ${config.siteName}`
  const canonicalUrl = `${config.baseUrl}${path}`
  const resolvedDescription = description ?? config.defaultDescription
  const resolvedImage = image ?? config.defaultImage
  const twitterCard = config.twitterCard ?? 'summary_large_image'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {resolvedDescription && <meta name="description" content={resolvedDescription} />}
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      {resolvedDescription && <meta property="og:description" content={resolvedDescription} />}
      {resolvedImage && <meta property="og:image" content={resolvedImage} />}
      <meta property="og:site_name" content={config.siteName} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {resolvedDescription && <meta name="twitter:description" content={resolvedDescription} />}
      {resolvedImage && <meta name="twitter:image" content={resolvedImage} />}
    </Helmet>
  )
}
