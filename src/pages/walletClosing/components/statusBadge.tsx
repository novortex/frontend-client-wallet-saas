// components/statusBadge.tsx
import { WalletClosing } from '../types'

interface StatusBadgeProps {
  status: WalletClosing['status']
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let bgColor = ''

  // Lógica para determinar a cor com base no status
  if (status === 'Closed') {
    bgColor = 'bg-blue-500'
  } else if (status === 'OK') {
    bgColor = 'bg-green-500'
  } else if (typeof status === 'string' && status.includes('days left')) {
    bgColor = 'bg-yellow-500'
  } else if (typeof status === 'string' && status.includes('days overdue')) {
    bgColor = 'bg-red-500'
  } else {
    bgColor = 'bg-gray-500'
  }

  return (
    <span className={`rounded-full px-2 py-1 text-white ${bgColor}`}>
      {status}
    </span>
  )
}
