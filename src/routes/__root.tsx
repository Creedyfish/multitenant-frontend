import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import StoreDevtools from '../lib/demo-store-devtools'
import { useAuth, useInitAuth } from '../features/auth/hooks'

import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'

// ─── Router Context ───────────────────────────────────────────────────────────

export interface MyRouterContext {
  queryClient: QueryClient
}

// ─── Route Definition ─────────────────────────────────────────────────────────

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Inventory Management' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  // shellComponent renders the full HTML document (SSR-aware).
  // This is different from `component` which only renders inside <body>.
  shellComponent: RootDocument,
})

// ─── Root Document ────────────────────────────────────────────────────────────

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking theme script — must be first to prevent theme flash */}
        <HeadContent />
      </head>
      <body className="font-sans [overflow-wrap:anywhere] antialiased selection:bg-[rgba(79,184,178,0.24)]">
        <TanStackQueryProvider>
          {/*
           * AuthProvider sits inside QueryProvider because useInitAuth()
           * uses the wretch apiClient which is independent of React Query,
           * but future auth queries might need the QueryClient available.
           */}
          <AuthProvider>{children}</AuthProvider>
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
              StoreDevtools,
            ]}
          />
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

// ─── Auth Provider ────────────────────────────────────────────────────────────

/**
 * Separated into its own component for a clean reason:
 * useInitAuth() and useAuth() are hooks — they need to be called inside
 * a component that is ALREADY wrapped by TanStackQueryProvider above.
 * If we called them directly in RootDocument, the QueryClient wouldn't
 * be available yet when the hooks run.
 *
 * This is a common React pattern: wrap with provider, then consume in child.
 */
function AuthProvider({ children }: { children: React.ReactNode }) {
  useInitAuth()
  const { isInitializing } = useAuth()

  if (isInitializing) return <AppLoadingScreen />

  return <>{children}</>
}

// ─── App Loading Screen ───────────────────────────────────────────────────────

/**
 * Shown only during the initial silent refresh (~200ms on fast connections).
 * Uses shadcn CSS variables so it matches your theme automatically.
 * Kept intentionally simple — no auth state exists yet when this renders.
 */
function AppLoadingScreen() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="border-muted border-t-primary h-8 w-8 animate-spin rounded-full border-4"
          role="status"
          aria-label="Loading"
        />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  )
}
