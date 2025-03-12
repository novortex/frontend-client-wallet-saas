import { formatToTwoDecimalPlaces } from '@/utils/formatToTwoDecimalPlates'
import React from 'react'

interface KpiCardProps {
  title: string
  performance: string | number
  percentagePerformance: string
  startDateUsed?: string
  endDateUsed?: string
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  performance,
  percentagePerformance,
  startDateUsed,
  endDateUsed,
}) => {
  const isMissingData = performance === '' || performance === '-'
  const performanceValue = !isMissingData ? Number(performance) : null
  const numPercentage = parseFloat(percentagePerformance)
  const isPositive = !isNaN(numPercentage) && numPercentage > 0
  const isNegative = !isNaN(numPercentage) && numPercentage < 0

  const formatDate = (date?: string) =>
    date && date !== '-'
      ? new Date(date)
          .toISOString()
          .split('T')[0]
          .split('-')
          .reverse()
          .join('/')
      : 'N/A'

  return (
    <div className="w-full max-w-xs rounded-lg border bg-gray-100 p-6 text-center shadow-md dark:border-gray-700 dark:bg-[#171717] dark:text-white">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>

      <p className="flex items-center justify-center text-2xl">
        {isMissingData ? (
          <span className="text-sm text-gray-400">
            Missing wallet registers for this period
          </span>
        ) : (
          <>
            {isPositive && (
              <span className="mr-1 text-green-500">
                ⬆ {formatToTwoDecimalPlaces(numPercentage ?? 0)}%
              </span>
            )}
            {isNegative && (
              <span className="mr-1 text-red-500">
                ⬇ {formatToTwoDecimalPlaces(numPercentage ?? 0)}%
              </span>
            )}
          </>
        )}
      </p>

      {!isMissingData && (
        <p className="mt-1 text-lg text-gray-400">{`$ ${formatToTwoDecimalPlaces(performanceValue ?? 0)}`}</p>
      )}

      {startDateUsed && endDateUsed && (
        <div className="mt-2 text-sm text-gray-400">
          <p>{`${formatDate(startDateUsed)} → ${formatDate(endDateUsed)}`}</p>
        </div>
      )}
    </div>
  )
}

export default KpiCard
