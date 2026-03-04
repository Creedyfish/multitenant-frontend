import { createFileRoute } from '@tanstack/react-router'

const dsn = new URL(process.env.VITE_SENTRY_DSN!)
const SENTRY_HOST = dsn.hostname
const SENTRY_PROJECT_ID = dsn.pathname.replace('/', '')

export const Route = createFileRoute('/api/tunnel')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const envelope = await request.text()
          const pieces = envelope.split('\n')
          const header = JSON.parse(pieces[0])
          const envelopeDsn = new URL(header.dsn)

          if (envelopeDsn.hostname !== SENTRY_HOST) {
            return new Response('Invalid DSN', { status: 400 })
          }

          const projectId = envelopeDsn.pathname.replace('/', '')
          if (projectId !== SENTRY_PROJECT_ID) {
            return new Response('Invalid project', { status: 400 })
          }

          const sentryUrl = `https://${SENTRY_HOST}/api/${projectId}/envelope/`
          const response = await fetch(sentryUrl, {
            method: 'POST',
            body: envelope,
          })

          return new Response(null, { status: response.status })
        } catch (e) {
          return new Response('Tunnel error', { status: 500 })
        }
      },
    },
  },
})
