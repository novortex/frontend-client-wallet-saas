import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PeriodType } from '@/types/cashFlowVolume.type'

interface PeriodSelectorProps {
  value: PeriodType
  onChange: (period: PeriodType) => void
}

const PERIOD_OPTIONS = [
  { value: 'daily' as const, label: 'Diário' },
  { value: 'weekly' as const, label: 'Semanal' },
  { value: 'monthly' as const, label: 'Mensal' },
  { value: 'quarterly' as const, label: 'Trimestral' },
]

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Período" />
      </SelectTrigger>
      <SelectContent>
        {PERIOD_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}