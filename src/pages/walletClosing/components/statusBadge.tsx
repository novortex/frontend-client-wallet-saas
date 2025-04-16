// components/StatusBadge.tsx
import { WalletClosing } from '../types'

interface StatusBadgeProps {
  status: WalletClosing['status']
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = ''
  switch (status) {
    case 'Completed':
      bgColor = 'bg-green-500'
      break
    case 'Pending':
      bgColor = 'bg-yellow-500'
      break
    case 'Failed':
      bgColor = 'bg-red-500'
      break
    case 'Processing':
      bgColor = 'bg-blue-500'
      break
    default:
      bgColor = 'bg-gray-500'
  }

  return (
    <span className={`rounded-full px-2 py-1 text-white ${bgColor}`}>
      {status}
    </span>
  )
}
