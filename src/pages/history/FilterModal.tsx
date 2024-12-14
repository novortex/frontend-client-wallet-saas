import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import filterIcon from '@/assets/image/filter-lines.png'
import { DatePickerWithRange } from './DatePickerWithRange'
import { EventTypeSelect } from './EventTypeSelect'
import { Filters } from '.'

type FilterModalProps = {
  onApplyFilters: (newFilters: Filters) => void
  currentFilters: Filters
}

export function FilterModal({
  onApplyFilters,
  currentFilters,
}: FilterModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-2 hover:bg-gray-700"
        >
          <img src={filterIcon} alt="Filter Icon" />
          <p>Filters</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[45%] w-[200%] bg-[#131313] text-[#fff] border-transparent">
        <DialogHeader>
          <DialogTitle className="text-3xl text-[#fff]">
            Event Filter
          </DialogTitle>
          <DialogDescription>
            Select an event type and/or a time range to filter events based on
            that.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>

            <EventTypeSelect
              selectedTypes={currentFilters.eventTypes}
              onChange={(newTypes) =>
                onApplyFilters({ ...currentFilters, eventTypes: newTypes })
              }
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="calendar" className="text-right">
              Calendar
            </Label>
            <DatePickerWithRange
              selectedRange={currentFilters.dateRange}
              onChange={(newRange) =>
                onApplyFilters({ ...currentFilters, dateRange: newRange })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
