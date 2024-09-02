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
import { Label } from '../ui/label'

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
  const [errors, setErrors] = useState({
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

  const validateInputs = () => {
    const newErrors = {
      name: '',
      email: '',
      cpf: '',
      phone: '',
    }

    // Normaliza a string removendo espaços extras
    const normalizedName = inputValues.name.replace(/\s+/g, ' ').trim()

    // Validação do nome: obrigatório, deve conter nome e sobrenome, apenas letras, e cada nome deve começar com uma letra maiúscula e ter pelo menos duas letras
    if (!/^[A-Z][a-z]{1,}(?:\s[A-Z][a-z]{1,})+\s*$/.test(normalizedName)) {
      newErrors.name =
        'Name must include both first and last names, each starting with a capital letter and containing at least two letters.'
    }

    // Validação do email: obrigatório e deve ter um formato de email válido
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+\s*$/.test(inputValues.email)) {
      newErrors.email = 'Invalid email format.'
    }

    // Validação do CPF: opcional, só valida se preenchido e deve conter entre 8 e 14 dígitos numéricos
    if (inputValues.cpf && !/^\d{8,14}\s*$/.test(inputValues.cpf)) {
      newErrors.cpf =
        'CPF must contain between 8 and 14 digits and only numbers.'
    }

    // Validação do telefone: opcional, só valida se preenchido e deve estar no formato +XX (XX)XXXXX-XXXX
    if (
      inputValues.phone &&
      !/^\+\d{2}\(\d{2}\)\d{5}-\d{4}\s*$/.test(inputValues.phone)
    ) {
      newErrors.phone = 'Invalid phone format. Use +XX(XX)XXXXX-XXXX.'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleRegisterCustomer = async () => {
    if (!validateInputs()) {
      toast({
        className: 'bg-red-500 border-0',
        title: 'Error validating inputs',
        description: 'Fix the errors and try again.',
      })
      return
    }

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
            <div className="h-full w-[45%] flex flex-col items-center justify-center text-center gap-3">
              <Input
                className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
                placeholder="Name *"
                name="name"
                value={inputValues.name}
                onChange={handleInputChange}
                ref={nameRef}
              />
              {errors.name && (
                <Label className="w-2/3 text-red-500">{errors.name}</Label>
              )}
            </div>
            <div className="h-full w-[45%] flex flex-col items-center justify-center text-center gap-3">
              <Input
                className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
                placeholder="Email *"
                name="email"
                value={inputValues.email}
                onChange={handleInputChange}
                ref={emailRef}
              />
              {errors.email && (
                <Label className="w-2/3 text-red-500">{errors.email}</Label>
              )}
            </div>
          </div>
          <div className="w-full h-1/2 flex flex-row justify-evenly items-center">
            <div className="h-full w-[45%] flex flex-col items-center justify-center text-center gap-3">
              <Input
                className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
                placeholder="CPF (optional)"
                name="cpf"
                value={inputValues.cpf}
                onChange={handleInputChange}
                ref={cpfRef}
              />
              {errors.cpf && (
                <Label className="w-2/3 text-red-500">{errors.cpf}</Label>
              )}
            </div>
            <div className="h-full w-[45%] flex flex-col items-center justify-center text-center gap-3">
              <Input
                className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
                placeholder="Phone (optional)"
                name="phone"
                value={inputValues.phone}
                onChange={handleInputChange}
                ref={phoneRef}
              />
              {errors.phone && (
                <Label className="w-2/3 text-red-500">{errors.phone}</Label>
              )}
            </div>
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
