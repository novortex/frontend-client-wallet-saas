import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'
import { StepForwardIcon, User } from 'lucide-react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import RelateClientExchangeModal from './relate-client-exchange-modal'
import { useState } from 'react'

interface RegisterCustomerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegisterCustomerModal({
  isOpen,
  onClose,
}: RegisterCustomerModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
    onClose()
  }

  const closeModal = () => {
    setIsModalOpen(false)
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
        <div className="gap-4">
          <div className="w-full h-1/2 flex flex-row justify-evenly items-center">
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Name"
            />
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Email"
            />
          </div>
          <div className="w-full h-1/2 flex flex-row justify-evenly items-center">
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="CPF (optional)"
            />
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Phone (optional)"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
            onClick={openModal}
          >
            <StepForwardIcon />
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
      <RelateClientExchangeModal isOpen={isModalOpen} onClose={closeModal} />
    </Dialog>
  )
}
