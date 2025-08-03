interface PerformanceBadgeProps {
  percentage: number
  showPercentage?: boolean
}

export function PerformanceBadge({
  percentage,
  showPercentage = true,
}: PerformanceBadgeProps) {
  const getStatusConfig = (percentage: number) => {
    if (percentage === 100) {
      return {
        label: 'Perfect',
        bgColor: 'bg-green-100 dark:bg-green-900',
        textColor: 'text-green-800 dark:text-green-100',
        dotColor: 'bg-green-500',
      }
    } else if (percentage >= 80) {
      return {
        label: 'Good',
        bgColor: 'bg-blue-100 dark:bg-blue-900',
        textColor: 'text-blue-800 dark:text-blue-100',
        dotColor: 'bg-blue-500',
      }
    } else if (percentage >= 60) {
      return {
        label: 'Warning',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900',
        textColor: 'text-yellow-800 dark:text-yellow-100',
        dotColor: 'bg-yellow-500',
      }
    } else {
      return {
        label: 'Critical',
        bgColor: 'bg-red-100 dark:bg-red-900',
        textColor: 'text-red-800 dark:text-red-100',
        dotColor: 'bg-red-500',
      }
    }
  }

  const config = getStatusConfig(percentage)

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.bgColor} ${config.textColor}`}
    >
      <div className={`h-2 w-2 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
      {showPercentage && (
        <span className="font-bold">{percentage.toFixed(1)}%</span>
      )}
    </div>
  )
}
