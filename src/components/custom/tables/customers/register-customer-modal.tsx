import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StepForwardIcon, User } from 'lucide-react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useRef, useState } from 'react'
import { useSignalStore } from '@/store/signalEffect'
import { registerNewCustomer } from '@/services/request'
import PhoneInput, { CountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from 'recharts'

interface RegisterCustomerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegisterCustomerModal({
  isOpen,
  onClose,
}: RegisterCustomerModalProps) {
  const [percentage, setPercentage] = useState(0)
  const [phone, setPhone] = useState('')
  const [phoneCountry, setPhoneCountry] = useState<CountryData>({
    name: '',
    dialCode: '',
    countryCode: '',
    format: '',
  })
  const [inputValues, setInputValues] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [setSignal, signal] = useSignalStore((state) => [
    state.setSignal,
    state.signal,
  ])

  const { toast } = useToast()

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const validateInputs = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
    }

    // Normaliza a string removendo espaços extras entre os nomes e trim no começo e final
    const normalizedName = inputValues.name.replace(/\s+/g, ' ').trim()

    // Validação do nome: obrigatório, deve conter nome e sobrenome, apenas letras (incluindo acentos),
    // e cada nome deve começar com uma letra maiúscula e ter pelo menos duas letras
    if (
      !/^[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,})+$/.test(
        normalizedName,
      ) ||
      /\s$/.test(inputValues.name) // Verifica se havia espaço no final antes da normalização
    ) {
      newErrors.name =
        'Name must include both first and last names, each starting with a capital letter and containing at least two letters.'
    }
    // Validação do email: obrigatório e deve ter um formato de email válido
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValues.email)) {
      newErrors.email = 'Invalid email format.'
    }
    if (!/^\d+$/.test(phone.replace(/\D/g, '')) || phone.trim().length < 11) {
      newErrors.phone =
        'The phone number must contain only numbers and include the country code.'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const formatPhoneNumber = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumber(
        phone,
        phoneCountry.countryCode.toUpperCase() as CountryCode,
      )

      // Formata o número internacional com o formato adequado
      return phoneNumber.formatInternational()
    } catch (error) {
      console.error('Invalid phone number:', error)
      return phone // Retorna o número original em caso de erro
    }
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

    onClose()

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add customer in organization',
      description: 'Demo Vault !!',
    })

    const formattedPhone = formatPhoneNumber(phone)
    console.log(formattedPhone)

    const customer = await registerNewCustomer(
      name as string,
      email as string,
      formattedPhone,
    )

    if (!customer) {
      setInputValues((item) => ({
        ...item,
        name: '',
        email: '',
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
        <div className="gap-4 flex flex-col items-center">
          {/* Linha superior: Name e Email */}
          <div className="w-full h-1/2 flex flex-col gap-5 justify-evenly items-center">
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

            <div className="h-full w-[30%] flex flex-col items-center justify-center text-center gap-3">
              <PhoneInput
                country={'br'}
                containerClass="flex bg-[#131313] border-[#323232] rounded-md border"
                inputClass="bg-[#131313] border-none text-[#959CB6]"
                dropdownClass="text-black"
                searchClass="bg-[#131313] border-[#323232] text-[#959CB6] "
                inputStyle={{
                  backgroundColor: '#131313',
                  color: '#959CB6',
                  border: 'none',
                }}
                value={phone}
                onChange={(phone, country) => {
                  // eslint-disable-next-line no-unused-expressions
                  setPhone(phone)
                  if (
                    country &&
                    'name' in country &&
                    'dialCode' in country &&
                    'countryCode' in country &&
                    'format' in country
                  ) {
                    setPhoneCountry(country as CountryData)
                  }
                }}
              />
              {errors.phone && (
                <Label className="w-2/3 text-red-500">{errors.phone}</Label>
              )}
            </div>
          </div>

          <div className="w-[30%]"></div>
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
