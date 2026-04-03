import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (rejection_reason: string) => void
  isPending: boolean
}

export function RejectDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: RejectDialogProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  function handleConfirm() {
    if (!reason.trim()) {
      setError('Please provide a rejection reason.')
      return
    }
    setError('')
    onConfirm(reason.trim())
  }

  function handleOpenChange(val: boolean) {
    if (!val) {
      setReason('')
      setError('')
    }
    onOpenChange(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 sm:max-w-110">
        <DialogHeader>
          <DialogTitle className="text-slate-50">
            Reject Purchase Request
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Provide a reason so the requester understands what needs to change.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Label className="mb-1.5 block text-xs text-slate-400">
            Rejection Reason <span className="text-rose-400">*</span>
          </Label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (e.target.value.trim()) setError('')
            }}
            placeholder="e.g. Budget exceeded, wrong supplier selected…"
            className={`w-full resize-none rounded-lg border px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-1 focus:outline-none ${
              error
                ? 'border-rose-500/50 bg-rose-500/5 focus:ring-rose-500/30'
                : 'border-slate-700 bg-slate-800/50 focus:border-sky-500/50 focus:ring-sky-500/30'
            }`}
          />
          {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            className="border border-slate-700 text-slate-300 hover:bg-slate-800"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="bg-rose-500 text-white hover:bg-rose-600"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Rejecting…
              </>
            ) : (
              'Reject PR'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
