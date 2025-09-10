import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Currency } from '@/types/cashFlowVolume.type'

interface CurrencySelectorProps {
  value: Currency
  onChange: (currency: Currency) => void
}

const CURRENCY_OPTIONS = [
  { value: 'BRL' as const, label: 'Real (R$)', symbol: 'R$' },
  { value: 'USD' as const, label: 'Dólar (US$)', symbol: 'US$' },
]

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Moeda" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}