import { createFileRoute } from '@tanstack/react-router'
import { PRDetailPage } from '#/features/purchase-requests/components/PRDetailPage'

export const Route = createFileRoute('/_authLayout/purchase-requests/$id')({
  component: PRDetailRoute,
})

function PRDetailRoute() {
  const { id } = Route.useParams()
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <PRDetailPage id={id} />
      </div>
    </div>
  )
}
