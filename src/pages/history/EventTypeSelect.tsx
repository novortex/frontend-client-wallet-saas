import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

  const buttonText =
    selectedTypes.length > 0
      ? selectedTypes.map(formatEventType).join(', ')
      : 'Select an event type'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="bg-white text-black w-fit">
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-[#131313] border-2 border-[#323232] cursor-pointer">
        {eventTypes.map((type) => (
          <DropdownMenuCheckboxItem
            key={type}
            checked={selectedTypes.includes(type)}
            onCheckedChange={() => handleCheckedChange(type)}
            className="text-white cursor-pointer hover:bg-gray-700"
          >
            {formatEventType(type)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
