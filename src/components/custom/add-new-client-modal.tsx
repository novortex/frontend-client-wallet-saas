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
        className: 'toast-warning',
        title: 'Processando cliente',
        description: 'Adicionando cliente à organização...',
      })

      const response = await registerNewCustomer(name, email, phone)

      if (!response) {
        return toast({
          className: 'toast-error',
          title: 'Erro ao adicionar cliente',
          description: 'Não foi possível adicionar o cliente à organização.',
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
        className: 'toast-success',
        title: 'Cliente adicionado com sucesso',
        description: 'O novo cliente foi adicionado à organização.',
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
        <div className="flex w-full flex-col gap-4">
          <div className="flex h-1/2 w-full flex-row items-center justify-between gap-4">
            <Input
              className="h-full w-1/2 border-[#323232] bg-[#272727] text-[#959CB6]"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="h-full w-1/2 border-[#323232] bg-[#272727] text-[#959CB6]"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex h-1/2 w-full flex-row items-center justify-between gap-4">
            <Input
              className="h-full w-1/2 border-[#323232] bg-[#272727] text-[#959CB6]"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="items-center">
          <div className="mr-5 flex gap-2 font-bold text-yellow-200">
            <AlertCircle />
            <span>This customer will be assigned to you</span>
          </div>
          <Button
            className="w-1/4 bg-[#1877F2] p-5 hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
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
