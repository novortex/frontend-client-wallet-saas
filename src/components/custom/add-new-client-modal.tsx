import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'
import * as React from 'react'
// import RelateClientModal from './relate-client-modal'
import { AlertCircle } from 'lucide-react'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '../ui/use-toast'
import { registerNewCustomer } from '@/services/managementService'

interface AddNewClientModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddNewClientModal({
  isOpen,
  onClose,
}: AddNewClientModalProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [signal, setSignal] = useSignalStore((state) => [
    state.signal,
    state.setSignal,
  ])
  const { toast } = useToast()

  const handleAddClient = async () => {
    try {
      onClose()

      toast({
        className: 'bg-yellow-500 border-0',
        title: 'Processing add client in organization',
        description: 'Demo Vault !!',
      })

      const response = await registerNewCustomer(name, email, phone)

      if (!response) {
        return toast({
          className: 'bg-red-500 border-0',
          title: 'Failed add client in organization',
          description: 'Demo Vault !!',
        })
      }

      // Reset the inputs
      // TODO: change for REF
      setName('')
      setEmail('')
      setPhone('')

      if (!signal) {
        setSignal(true)
      } else {
        setSignal(false)
      }

      return toast({
        className: 'bg-green-500 border-0',
        title: 'Success update !!',
        description: 'Demo Vault !!',
      })
    } catch (error) {
      console.error('Erro ao cadastrar novo cliente:', error)
      // Tratar o erro conforme necessário
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-[#fff]">
            Register new customer
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-center">
            <Input
              className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6]"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6]"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-center">
            <Input
              className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6]"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="items-center">
          <div className="font-bold text-yellow-200 flex gap-2 mr-5">
            <AlertCircle />
            <span>This customer will be assigned to you</span>
          </div>
          <Button
            className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5"
            onClick={() => {
              handleAddClient()
            }}
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
      {/* //<RelateClientModal isOpen={isModalOpen} onClose={closeModal} /> */}
    </Dialog>
  )
}
