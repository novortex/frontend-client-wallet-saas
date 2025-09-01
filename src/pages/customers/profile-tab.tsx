import PhoneInput, { CountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'

interface ProfileTabProps {
  name: string
  email: string
  phone: string
  errors: {
    name: string
    email: string
    phone: string
    general: string
  }
  setName: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void
  setPhoneCountry: (country: CountryData) => void
  handleUpdateCustomer: () => Promise<void>
}

export function ProfileTab({
  name,
  email,
  phone,
  errors,
  setName,
  setEmail,
  setPhone,
  setPhoneCountry,
  handleUpdateCustomer,
}: ProfileTabProps) {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const updateTheme = () => {
      const theme = localStorage.getItem('theme')
      setIsDark(theme === 'dark')
    }
    updateTheme()
    window.addEventListener('storage', updateTheme)
    return () => window.removeEventListener('storage', updateTheme)
  }, [])
  return (
    <div>
      <div className="grid grid-cols-2 justify-items-center gap-5">
        <div className="w-full">
          <Label className="ml-2" htmlFor="Name">
            Name
          </Label>
          <Input
            className="w-full border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
            type="text"
            id="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          {errors.name && (
            <Label className="max-w-[300px] whitespace-normal break-words text-red-500">
              {errors.name}
            </Label>
          )}
        </div>
        <div className="w-full">
          <Label className="ml-2" htmlFor="email">
            Email
          </Label>
          <Input
            className="w-full border bg-lightComponent dark:border-[#323232] dark:bg-[#131313] dark:text-[#959CB6]"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {errors.email && (
            <Label className="max-w-[300px] whitespace-normal break-words text-red-500">
              {errors.email}
            </Label>
          )}
        </div>
        <div className="w-full">
          <Label className="ml-2" htmlFor="Phone">
            Phone
          </Label>
          <PhoneInput
            key={`phone-input-${isDark ? 'dark' : 'light'}`}
            country="br"
            value={phone}
            onChange={(phone, country) => {
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
            containerClass={`flex ${
              isDark
                ? 'bg-[#131313] border-[#323232] text-[#959CB6]'
                : 'bg-white border-gray-300 text-black'
            } rounded-md border`}
            inputClass={
              isDark
                ? 'bg-[#131313] border-none text-[#959CB6]'
                : 'bg-white border border-gray-300 text-black'
            }
            dropdownClass={
              isDark ? 'bg-[#131313] text-[#959CB6]' : 'bg-white text-black'
            }
            searchClass={
              isDark
                ? 'bg-[#131313] border-[#323232] text-[#959CB6]'
                : 'bg-white border border-gray-300 text-black'
            }
            inputStyle={
              isDark
                ? {
                    backgroundColor: '#131313',
                    color: '#959CB6',
                    border: 'none',
                    width: '100%',
                  }
                : {
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    width: '100%',
                  }
            }
          />
          {errors.phone && (
            <Label className="max-w-[300px] whitespace-normal break-words text-red-500">
              {errors.phone}
            </Label>
          )}
        </div>
      </div>
      <div className="mt-12 flex justify-end gap-5">
        <Button
          onClick={handleUpdateCustomer}
          className="bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
        >
          Save Profile
        </Button>
        <DialogClose asChild>
          <Button className="btn-red">
            Close
          </Button>
        </DialogClose>
      </div>
    </div>
  )
}
