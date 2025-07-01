import { Check, Clock, AlertTriangle } from 'lucide-react'
import { CallRecord } from '../hooks/useCallMonitoring'

interface StatusInfo {
  status: 'ok' | 'days_left' | 'overdue' | 'no_call'
  message: string
}

interface StatusBadgeProps {
  call: CallRecord
  calculateCallStatus: (date: string | null | undefined) => StatusInfo
}

export function StatusBadge({ call, calculateCallStatus }: StatusBadgeProps) {
  if (!call.monthCloseDate) {
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Outdated
      </span>
    )
  }
  const statusInfo = calculateCallStatus(call.monthCloseDate)
  switch (statusInfo.status) {
    case 'ok':
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
          <Check className="mr-1 h-3 w-3" />
          {statusInfo.message}
        </span>
      )
    case 'days_left':
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
          <Clock className="mr-1 h-3 w-3" />
          {statusInfo.message}
        </span>
      )
    case 'overdue':
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
          <AlertTriangle className="mr-1 h-3 w-3" />
          {statusInfo.message}
        </span>
      )
  }
}
