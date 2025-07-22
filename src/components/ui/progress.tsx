interface ProgressProps {
  value: number
  className?: string
}

export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div
      className={`h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
    >
      <div
        className="h-2.5 rounded-full bg-blue-600 transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
