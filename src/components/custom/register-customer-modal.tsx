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
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useRef, useState } from 'react'
import { useUserStore } from '@/store/user'
import { useSignalStore } from '@/store/signalEffect'
import { useToast } from '../ui/use-toast'
import { registerNewCustomer } from '@/service/request'

interface RegisterCustomerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegisterCustomerModal({
  isOpen,
  onClose,
}: RegisterCustomerModalProps) {
  const [percentage, setPercentage] = useState(0)
  const [inputValues, setInputValues] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
  })
  const [uuidOrganization] = useUserStore((state) => [
    state.user.uuidOrganization,
  ])
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const { toast } = useToast()

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const cpfRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)

  const handleRegisterCustomer = async () => {
    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const cpf = cpfRef.current?.value
    const phone = phoneRef.current?.value

    onClose()

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add customer in organization',
      description: 'Demo Vault !!',
    })

    //     name: string,
    //   email: string,
    //   organizationUuid: string,
    //   cpf?: string,
    //   phone?: string

    const customer = await registerNewCustomer(
      name as string,
      email as string,
      uuidOrganization,
      cpf,
      phone,
    )

    if (!customer) {
      setInputValues((item) => ({
        ...item,
        name: '',
        email: '',
        cpf: '',
        phone: '',
      }))

      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed add Asset in organization',
        description: 'Demo Vault !!',
      })
    }

    setInputValues((item) => ({
      ...item,
      name: '',
      email: '',
      cpf: '',
      phone: '',
    }))

    if (!signal) {
      setSignal(true)
    } else {
      setSignal(false)
    }

    return toast({
      className: 'bg-green-500 border-0',
      title: 'Success !! new customer in organization',
      description: 'Demo Vault !!',
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const isEmptyBefore = inputValues[name as keyof typeof inputValues] === ''
    const isEmptyAfter = value === ''

    setInputValues({
      ...inputValues,
      [name]: value,
    })

    if (isEmptyBefore && !isEmptyAfter) {
      setPercentage((prev) => Math.min(prev + 25, 100))
    } else if (!isEmptyBefore && isEmptyAfter) {
      setPercentage((prev) => Math.max(prev - 25, 0))
    }
  }

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
            <CircularProgressbar
              styles={buildStyles({
                pathColor: `#F2BE38`,
                textColor: '#F2BE38',
                trailColor: '',
              })}
              value={percentage}
              text={`${percentage}%`}
            />
          </div>
        </div>
        <div className="gap-4">
          <div className="w-full h-1/2 flex flex-row justify-evenly items-center">
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Name"
              name="name"
              value={inputValues.name}
              onChange={handleInputChange}
              ref={nameRef}
            />
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Email"
              name="email"
              value={inputValues.email}
              onChange={handleInputChange}
              ref={emailRef}
            />
          </div>
          <div className="w-full h-1/2 flex flex-row justify-evenly items-center">
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="CPF (optional)"
              name="cpf"
              value={inputValues.cpf}
              onChange={handleInputChange}
              ref={cpfRef}
            />
            <Input
              className="w-1/3 bg-[#131313] border-[#323232] text-[#959CB6]"
              placeholder="Phone (optional)"
              name="phone"
              value={inputValues.phone}
              onChange={handleInputChange}
              ref={phoneRef}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button
            className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3"
            onClick={handleRegisterCustomer}
          >
            <StepForwardIcon />
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
