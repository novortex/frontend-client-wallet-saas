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
import { Wallet, StepForwardIcon } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

interface CreateWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateWalletModal({
  isOpen,
  onClose,
}: CreateWalletModalProps) {
  const percentage = 20

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-[60%] bg-[#131313] text-[#fff] max-w-full border-transparent">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 text-3xl items-center">
            Register new Wallet <Wallet className="text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-evenly">
          <div className="w-[26%] h-full flex items-center flex-row">
            <div className="w-[35%]">
              <Select>
                <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectValue>USD</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                  <SelectItem value="null">
                    <div></div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex h-full w-[26%] justify-center items-center">
            <div style={{ width: 65, height: 65 }}>
              <CircularProgressbar value={20} text={`${percentage}%`} />
            </div>
          </div>
          <div className="flex h-full w-[26%]"></div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%]">
            <Label>Performance Fee</Label>
            <Input
              placeholder="Ex: 10%"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
            />
          </div>
          <div className="w-[26%]">
            <Label>Benchmark</Label>
            <Select>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue placeholder="Benchmark">Benchmark</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectItem value="null">
                  <div></div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[26%]">
            <Label>Risk Profile</Label>
            <Select>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue>STANDARD</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectItem value="null">
                  <div></div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%] h-full">
            <Label>Initial Fee $</Label>
            <Input
              placeholder="Ex: $ 1,000"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
            />
          </div>
          <div className="w-[26%] h-full">
            <Label>Invested amount</Label>
            <Input
              placeholder="Ex: $ 1,000"
              className="bg-[#131313] border-[#323232] text-[#959CB6]"
            />
          </div>
          <div className="w-[26%] h-full flex flex-row gap-5 items-center">
            <Label>Contract</Label>
            <Checkbox className="border-gray-500" />
          </div>
        </div>
        <div className="flex flex-row justify-evenly items-center">
          <div className="w-[26%]">
            <Label>Choose a manager</Label>
            <Select>
              <SelectTrigger className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectValue placeholder="Name">Name</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-[#323232] text-[#959CB6]">
                <SelectItem value="null">
                  <div></div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
            onClick={onClose}
          >
            <StepForwardIcon />
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
