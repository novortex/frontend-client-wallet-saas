import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

const formatEventType = (eventType: string) => {
  return eventType
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const eventTypes = [
  'SELL_ASSET',
  'BUY_ASSET',
  'INCREASE_ALLOCATION',
  'DECREASE_ALLOCATION',
  'ADD_ASSET',
  'DELETE_ASSET',
  'WITHDRAWAL',
  'DEPOSIT',
  'START_WALLET',
  'CLOSE_WALLET',
]

type EventTypeSelectProps = {
  selectedTypes: string[]
  onChange: (selectedTypes: string[]) => void
}

export function EventTypeSelect({
  selectedTypes,
  onChange,
}: EventTypeSelectProps) {
  const handleCheckedChange = (type: string) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((item) => item !== type)
      : [...selectedTypes, type]
    onChange(updatedTypes)
  }

  return (
    <div className="w-full">
      <div className="font-bold text-[#959CB6] mb-2">Event Types</div>
      <div className="grid grid-cols-2 gap-4 text-[#fff]">
        {eventTypes.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <Checkbox
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => handleCheckedChange(type)}
              className="border-[#fff]"
            />
            <Label className="cursor-pointer">{formatEventType(type)}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}
