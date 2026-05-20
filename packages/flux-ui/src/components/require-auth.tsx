import { useEffect, type ReactNode } from 'react'

/**
 * Generic auth guard. Library-internal — does not depend on Clerk or any
 * specific auth provider. The consumer passes the current state (isLoaded,
 * isSignedIn) plus a `redirect` callback fired when the user needs to sign in.
 *
 * - While loading: renders `fallback` (default: null).
 * - Signed out: invokes `redirect()` in an effect and renders `fallback`.
 * - Signed in: renders `children`.
 *
 * When `enabled === false` the gate is bypassed entirely (children render),
 * which lets a single tree work in both auth-enabled and no-auth deployments.
 */
interface RequireAuthProps {
  /** Whether the auth gate is active. When false, children render unconditionally. */
  enabled?: boolean
  isLoaded: boolean
  isSignedIn: boolean
  redirect: () => void
  /** Shown while loading or while waiting for the redirect to take effect. */
  fallback?: ReactNode
  children: ReactNode
}

export function RequireAuth({
  enabled = true,
  isLoaded,
  isSignedIn,
  redirect,
  fallback = null,
  children,
}: RequireAuthProps) {
  useEffect(() => {
    if (!enabled) return
    if (isLoaded && !isSignedIn) redirect()
  }, [enabled, isLoaded, isSignedIn, redirect])

  if (!enabled) return <>{children}</>
  if (!isLoaded) return <>{fallback}</>
  if (!isSignedIn) return <>{fallback}</>
  return <>{children}</>
}
