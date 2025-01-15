import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { CalendarIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  closeWallet,
  startWallet as requestStartWallet,
} from '@/services/request'
import { useParams } from 'react-router-dom'
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'

interface ConfirmCloseWalletModalProps {
  isOpen: boolean
  onClose: () => void
  startWallet: boolean
  fetchData: () => Promise<void>
}

export default function ConfirmCloseWalletModal({
  isOpen,
  onClose,
  startWallet,
  fetchData,
}: ConfirmCloseWalletModalProps) {
  const [inputValue, setInputValue] = useState('')
  const [date, setDate] = useState<Date>(new Date())
  const { walletUuid } = useParams()
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [signal, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])

  const isToday = (dateToCheck: Date) => {
    const today = new Date()
    return (
      dateToCheck.getDate() === today.getDate() &&
      dateToCheck.getMonth() === today.getMonth() &&
      dateToCheck.getFullYear() === today.getFullYear()
    )
  }
  const expectedValue = startWallet ? 'startwallet' : 'closewallet'
  const valueOfDate = startWallet ? 'was started' : 'will be closed'
  const isInputValid = inputValue === expectedValue

  const handleSendWalletAction = async () => {
    const customDate = date.toISOString()
    if (walletUuid) {
      if (startWallet) {
        await requestStartWallet(uuidOrganization, walletUuid)
      } else {
        await closeWallet(uuidOrganization, walletUuid, { customDate })
      }
    }
    setSignal(!signal)
    fetchData()
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setDate(new Date())
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[80%] w-[40%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle className="text-3xl">Confirmation</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 h-full justify-center items-center">
          <p>Choose the date that the wallet {valueOfDate}</p>

          <div className="flex flex-col gap-2 w-1/2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-[#131313] border-[#323232] text-[#959CB6] justify-between"
                >
                  {date.toLocaleDateString()}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  className="bg-[#131313] text-white rounded-md"
                  classNames={{
                    day_today: isToday(date)
                      ? 'bg-white text-black hover:bg-white rounded-md'
                      : 'bg-transparent text-white hover:bg-white rounded-md text-black',
                    day_selected:
                      'bg-white text-black hover:bg-white rounded-md',
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Label className="flex flex-row gap-3 text-lg">
            <p className="text-[#959CB6]">Type to confirm:</p>
            <p>{expectedValue}</p>
          </Label>

          <Input
            placeholder="Type here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-1/2 bg-[#131313] border-[#323232] text-[#959CB6]"
          />
        </div>

        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-[20%] hover:bg-blue-600 p-5"
            disabled={!isInputValid}
            onClick={handleSendWalletAction}
          >
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
