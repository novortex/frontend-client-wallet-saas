
interface PieChartTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: {
      name: string
      value: number
    }
  }>
  label?: string
  valueFormatter?: (value: number) => string
}

export function PieChartTooltip({ 
  active, 
  payload, 
  valueFormatter 
}: PieChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0]
  const formattedValue = valueFormatter ? valueFormatter(data.value) : data.value.toString()
  
  return (
    <div 
      className="
        bg-popover/95 
        border 
        border-border 
        rounded-lg 
        shadow-xl 
        px-4 
        py-3 
        text-popover-foreground 
        min-w-[140px] 
        max-w-[200px]
        transition-all
        duration-300
        ease-out
        backdrop-blur-sm
        animate-in
        fade-in-0
        zoom-in-95
        slide-in-from-bottom-2
      "
      style={{
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 25px -5px hsl(var(--shadow) / 0.1), 0 4px 6px -2px hsl(var(--shadow) / 0.05)',
      }}
    >
      <div 
        className="font-semibold text-foreground mb-1.5 leading-tight"
        style={{ fontSize: '14px' }}
      >
        {data.payload.name}
      </div>
      <div 
        className="text-muted-foreground font-medium"
        style={{ fontSize: '13px', fontWeight: '500' }}
      >
        {formattedValue}
      </div>
    </div>
  )
}