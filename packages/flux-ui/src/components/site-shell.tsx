import {
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'

import { useTheme } from '../theme/use-theme'
import { cn } from '../lib/cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NavLink {
  label: string
  /** Internal route path (rendered via `LinkComponent`) — mutually exclusive with `href`. */
  to?: string
  /** External URL (rendered as `<a>` with `target="_blank"`). */
  href?: string
}

interface FooterLink {
  label: string
  href: string
}

/** Polymorphic link component. Defaults to `<a>`. Pass react-router-dom's `Link`. */
type LinkComponent = ComponentType<{
  to: string
  className?: string
  children?: ReactNode
}>

const DefaultLink: LinkComponent = ({ to, className, children }) => (
  <a href={to} className={className}>
    {children}
  </a>
)

export interface BrandConfig {
  /** Primary brand/product name shown next to the logo. */
  name: string
  /** Optional path or URL the brand block links to. Defaults to `/`. */
  href?: string
  /** Optional logo URL. Renders a square 40px logo when provided. */
  logo?: string
  /** Optional parent/umbrella brand shown before the primary name (e.g. "FluxGateAI / ResuMaker"). */
  parent?: {
    name: string
    href: string
  }
}

export interface SiteShellProps {
  children: ReactNode
  brand: BrandConfig
  /** Desktop nav links rendered between the brand and the theme toggle. */
  navLinks?: NavLink[]
  /** Optional ReactNode rendered after the theme toggle (e.g. auth button). */
  authSlot?: ReactNode
  /** Override the link component used for internal `to` paths. Useful with react-router. */
  LinkComponent?: LinkComponent
  /** Override the footer copyright line. Defaults to "© {year} {brand.name}". */
  footerCopyright?: ReactNode
  /** Footer link list. */
  footerLinks?: FooterLink[]
  /** Hide the theme toggle button (some consumers prefer no toggle). */
  hideThemeToggle?: boolean
  /** Hide the grain overlay. */
  hideGrain?: boolean
  /** Hide the ambient glow. */
  hideAmbientGlow?: boolean
  /** Optional class applied to the outermost wrapper. */
  className?: string
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Theme toggle (exported standalone too — see index.ts)
// ---------------------------------------------------------------------------

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        'flex w-[106px] items-center justify-center gap-2 rounded-full border border-border bg-card/80 py-1.5 font-sans text-xs text-muted-foreground backdrop-blur-xs transition-all hover:border-primary/40 hover:text-primary active:scale-[0.97]',
        className,
      )}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

// ---------------------------------------------------------------------------
// NavBar
// ---------------------------------------------------------------------------

interface NavBarProps {
  brand: BrandConfig
  navLinks: NavLink[]
  authSlot?: ReactNode
  LinkComponent: LinkComponent
  hideThemeToggle: boolean
}

function NavBar({ brand, navLinks, authSlot, LinkComponent, hideThemeToggle }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const renderNavLinks = (extraClassName?: string) => (
    <>
      {navLinks.map((link) => {
        const cls = cn(
          'font-sans text-[0.8125rem] text-muted-foreground transition-colors hover:text-foreground',
          extraClassName,
        )
        if (link.href) {
          return (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
              {link.label}
            </a>
          )
        }
        return (
          <LinkComponent key={link.label} to={link.to ?? '/'} className={cls}>
            {link.label}
          </LinkComponent>
        )
      })}
    </>
  )

  const brandHref = brand.href ?? '/'

  return (
    <header className="relative z-20 px-6 py-5">
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          {brand.parent ? (
            <a
              href={brand.parent.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              {brand.logo && (
                <img src={brand.logo} alt={brand.parent.name} className="h-10 w-10 rounded-[0.625rem]" />
              )}
              <span className="hidden font-display text-[1.35rem] font-semibold tracking-tight sm:inline">
                {brand.parent.name}
              </span>
            </a>
          ) : (
            <LinkComponent to={brandHref} className="flex items-center gap-3">
              {brand.logo && <img src={brand.logo} alt={brand.name} className="h-10 w-10 rounded-[0.625rem]" />}
              <span className="hidden font-display text-[1.35rem] font-semibold tracking-tight sm:inline">
                {brand.name}
              </span>
            </LinkComponent>
          )}
          {brand.parent && (
            <>
              <span className="hidden font-display text-[1.35rem] font-light text-border/60 select-none sm:inline">
                /
              </span>
              <LinkComponent
                to={brandHref}
                className="hidden font-display text-[1.35rem] font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground sm:inline"
              >
                {brand.name}
              </LinkComponent>
            </>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {renderNavLinks()}
          {!hideThemeToggle && navLinks.length > 0 && <div className="h-4 w-px bg-border/40" />}
          {!hideThemeToggle && <ThemeToggle />}
          {authSlot && (
            <>
              <div className="h-4 w-px bg-border/40" />
              {authSlot}
            </>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          {authSlot}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="absolute inset-x-0 top-full z-50 border-b border-border/40 bg-background/95 px-6 py-4 backdrop-blur-md md:hidden"
          onClick={closeMobile}
        >
          <div className="flex flex-col gap-4">
            {renderNavLinks()}
            {!hideThemeToggle && (
              <>
                <div className="h-px bg-border/30" />
                <ThemeToggle className="w-auto justify-start border-0 bg-transparent p-0 backdrop-blur-none" />
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}

// ---------------------------------------------------------------------------
// SiteShell
// ---------------------------------------------------------------------------

export function SiteShell({
  children,
  brand,
  navLinks = [],
  authSlot,
  LinkComponent = DefaultLink,
  footerCopyright,
  footerLinks = [],
  hideThemeToggle = false,
  hideGrain = false,
  hideAmbientGlow = false,
  className,
}: SiteShellProps) {
  // Hydrate the .dark class once on the client. Apps that already manage the
  // class themselves (e.g. via index.html script tag) won't notice this.
  const { resolvedTheme } = useTheme()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [resolvedTheme])

  const defaultCopyright = (
    <span className="font-sans text-[0.6875rem] text-muted-foreground/50">
      © {new Date().getFullYear()} {brand.name}
    </span>
  )

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col overflow-hidden font-sans leading-[1.6]',
        className,
      )}
    >
      {!hideGrain && <div className="grain-overlay" />}
      {!hideAmbientGlow && <div className="ambient-glow" />}

      <NavBar
        brand={brand}
        navLinks={navLinks}
        authSlot={authSlot}
        LinkComponent={LinkComponent}
        hideThemeToggle={hideThemeToggle}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        {children}
      </div>

      <footer className="relative z-10 border-t border-border/30 px-6 py-5">
        <div className="container mx-auto flex flex-col items-center gap-2 px-6 sm:flex-row sm:justify-between">
          {footerCopyright ?? defaultCopyright}
          {footerLinks.length > 0 && (
            <nav className="flex items-center gap-4">
              {footerLinks.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[0.6875rem] text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                >
                  {label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </footer>
    </div>
  )
}
