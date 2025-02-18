import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { StepForwardIcon, User } from 'lucide-react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useRef, useState } from 'react'
import { useSignalStore } from '@/store/signalEffect'
import { registerNewCustomer } from '@/services/managementService'
import PhoneInput, { CountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'

interface RegisterCustomerModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegisterCustomerModal({ isOpen, onClose }: RegisterCustomerModalProps) {
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
  const [setSignal, signal] = useSignalStore((state) => [state.setSignal, state.signal])

  const { toast } = useToast()

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const validateInputs = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
    }

    const normalizedName = inputValues.name.replace(/\s+/g, ' ').trim()

    if (!/^[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,}(?:\s[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]{1,})+$/.test(normalizedName) || /\s$/.test(inputValues.name)) {
      newErrors.name = 'Minimum two names, all starting with a capital letter and containing at least two letters.'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValues.email)) {
      newErrors.email = 'Invalid email format.'
    }
    if (!/^\d+$/.test(phone.replace(/\D/g, '')) || phone.trim().length < 13) {
      newErrors.phone = 'Must start with contry code, include the 9 additional digit.'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const formatPhoneNumber = (phone: string) => {
    try {
      const phoneNumber = parsePhoneNumber(phone, phoneCountry.countryCode.toUpperCase() as CountryCode)
      return phoneNumber.formatInternational()
    } catch (error) {
      console.error('Invalid phone number:', error)
      return phone
    }
  }

  const handleRegisterCustomer = async () => {
    if (!validateInputs()) {
      return
    }

    const name = nameRef.current?.value
    const email = emailRef.current?.value.toLowerCase().trim()

    onClose()

    toast({
      className: 'bg-yellow-500 border-0',
      title: 'Processing add customer in organization',
      description: 'Demo Vault !!',
    })

    const formattedPhone = formatPhoneNumber(phone)

    const customer = await registerNewCustomer(name as string, email as string, formattedPhone)

    if (!customer) {
      setInputValues((item) => ({
        ...item,
        name: '',
        email: '',
        phone: '',
      }))

      return toast({
        className: 'bg-red-500 border-0',
        title: 'Failed to add customer in organization',
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
      title: 'Success! New customer added to the organization',
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
      <DialogContent className="h-[80vh] w-[60%] bg-[#131313] text-[#fff] max-w-full border-transparent flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 text-3xl items-center">
            Register new Customer <User className="text-[#F2BE38]" />
          </DialogTitle>
        </DialogHeader>

        {/* Added overflow-y-auto to keep content scrollable */}
        <div className="flex flex-col justify-center flex-grow gap-4 overflow-y-auto px-4">
          <div className="flex justify-center items-start">
            <div style={{ width: 65, height: 65 }}>
              <CircularProgressbar
                styles={buildStyles({
                  pathColor: `#F2BE38`,
                  textColor: '#F2BE38',
                })}
                value={percentage}
                text={`${percentage}%`}
              />
            </div>
          </div>

          <div className="gap-4 flex flex-col items-center">
            {/* Name and Email Fields */}
            <div className="w-full flex flex-col gap-5 justify-evenly items-center">
              {/* Name */}
              <div className="w-[45%] flex flex-col items-center text-center">
                <Input
                  className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
                  placeholder="Name *"
                  name="name"
                  value={inputValues.name}
                  onChange={handleInputChange}
                  ref={nameRef}
                />
                {errors.name && <div className="w-2/3 text-red-500 text-sm">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="w-[45%] flex flex-col items-center text-center">
                <Input
                  className="w-2/3 bg-[#131313] border-[#323232] text-[#959CB6]"
                  placeholder="Email *"
                  name="email"
                  value={inputValues.email}
                  onChange={handleInputChange}
                  ref={emailRef}
                />
                {errors.email && <div className="w-2/3 text-red-500 text-sm">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="w-[30%] flex flex-col items-center text-center">
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
                    setPhone(phone)
                    setPhoneCountry(country as CountryData)
                  }}
                />
                {errors.phone && <div className="w-2/3 text-red-500 text-sm">{errors.phone}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Keeps button at the bottom */}
        <DialogFooter className="flex justify-end items-center pt-4">
          <Button className="bg-[#1877F2] w-1/6 hover:bg-blue-600 p-5 flex items-center justify-center gap-3" onClick={handleRegisterCustomer}>
            <StepForwardIcon />
            Finish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
