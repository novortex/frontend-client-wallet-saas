import { HistoricEntry } from '@/types/wallet.type'
import HistoryTimelineItem from './history-timeline-item'
import HistoryGroupHeader from './history-group-header'

interface HistoryTimelineProps {
  entries: HistoricEntry[]
  fiatCurrency: string
}

export default function HistoryTimeline({
  entries,
  fiatCurrency,
}: HistoryTimelineProps) {
  const groupedEntries = entries.reduce(
    (groups, entry) => {
      const date = new Date(entry.createAt).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(entry)
      return groups
    },
    {} as Record<string, HistoricEntry[]>,
  )

  const sortedDates = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  )

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-6 top-0 w-px bg-border"></div>

      <div className="space-y-3">
        {sortedDates.map((date) => (
          <div key={date}>
            <HistoryGroupHeader
              date={date}
              count={groupedEntries[date].length}
            />

            <div className="ml-2 space-y-2">
              {groupedEntries[date]
                .sort(
                  (a, b) =>
                    new Date(b.createAt).getTime() -
                    new Date(a.createAt).getTime(),
                )
                .map((entry) => (
                  <HistoryTimelineItem
                    key={entry.cuid}
                    entry={entry}
                    fiatCurrency={fiatCurrency}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
