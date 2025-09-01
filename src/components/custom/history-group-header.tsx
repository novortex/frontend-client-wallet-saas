interface HistoryGroupHeaderProps {
  date: string
  count: number
}

export default function HistoryGroupHeader({ date, count }: HistoryGroupHeaderProps) {
  return (
    <div className="relative flex items-center mb-6">
      <div className="absolute left-5 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
      
      <div className="ml-12 flex items-center justify-between w-full">
        <div className="bg-muted px-4 py-2 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground">{date}</h3>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {count} {count === 1 ? 'operação' : 'operações'}
        </div>
      </div>
    </div>
  )
}