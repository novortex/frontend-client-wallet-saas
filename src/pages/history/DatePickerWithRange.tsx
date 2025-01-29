import { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

type DatePickerWithRangeProps = {
  selectedRange?: DateRange
  onChange: (range: DateRange | undefined) => void
}

export function DatePickerWithRange({
  selectedRange,
  onChange,
}: DatePickerWithRangeProps) {
  const handleDateSelect = (
    range: DateRange | undefined
  ) => {
    if (range?.from && range?.to) {
      onChange(range)
    } else if (range?.from) {
      onChange({
        from: range.from,
        to: range.from,
      })
    } else {
      onChange(undefined)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className="w-fit justify-center text-center font-normal text-black gap-2"
        >
          <CalendarIcon />
          {selectedRange?.from ? (
            selectedRange.to ? (
              <>
                {format(
                  selectedRange.from,
                  'LLL dd, y'
                )}{' '}
                -{' '}
                {format(
                  selectedRange.to,
                  'LLL dd, y'
                )}
              </>
            ) : (
              format(
                selectedRange.from,
                'LLL dd, y'
              )
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 cursor-pointer"
        align="start"
      >
        <Calendar
          initialFocus
          mode="range"
          selected={selectedRange}
          onSelect={handleDateSelect}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  )
}
