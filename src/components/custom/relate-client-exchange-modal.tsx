import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '../ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { StepForwardIcon, User } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface RelateClientExchangeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RelateClientExchangeModal({
  isOpen,
  onClose,
}: RelateClientExchangeModalProps) {
  const closeModal = () => {
    console.log('enviado')
    onClose()
  }

  const percentage = 20

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-[60%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 text-3xl items-center">
            Register new Customer <User className="text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-start">
          <div style={{ width: 65, height: 65 }}>
            <CircularProgressbar value={20} text={`${percentage}%`} />
          </div>
        </div>
        <div className="flex flex-row">
          <div className="w-[48%] flex flex-col justify-start items-center gap-10">
            <div className="w-2/3">
              <Label>Exchange</Label>
              <Select>
                <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectValue placeholder="Exchange">Exchange</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectItem value="null">
                    <div></div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-2/3 flex flex-row gap-4">
              <Label>Initial Fee is paid?</Label>
              <Checkbox className="border-gray-500" />
            </div>
          </div>
          <div className="flex items-center justify-center w-[4%]">
            <div className="w-[2px] bg-gray-500 h-full"></div>
          </div>
          <div className="w-[48%] flex flex-col justify-evenly items-center gap-5">
            <div className="flex flex-row gap-4 ">
              <Label>Include exchange information?</Label>
              <Checkbox className="border-gray-500" />
            </div>
            <Input
              className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Name exchange"
            />
            <Input
              className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Name exchange"
            />
            <Input
              className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Name exchange"
            />
            <Input
              className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Name exchange"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
            onClick={closeModal}
          >
            <StepForwardIcon />
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
