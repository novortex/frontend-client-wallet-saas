import PhoneInput, { CountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'

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
  return (
    <div>
      <div className="grid justify-items-center grid-cols-2 gap-5">
        <div>
          <Label className="ml-2" htmlFor="Name">
            Name
          </Label>
          <Input
            className="bg-[#131313] border-[#323232] text-[#959CB6] w-full"
            type="text"
            id="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          {errors.name && <Label className="text-red-500">{errors.name}</Label>}
        </div>

        <div>
          <Label className="ml-2" htmlFor="email">
            Email
          </Label>
          <Input
            className="bg-[#131313] border-[#323232] text-[#959CB6] w-full"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {errors.email && (
            <Label className="text-red-500">{errors.email}</Label>
          )}
        </div>

        <div>
          <Label className="ml-2" htmlFor="Phone">
            Phone
          </Label>
          <PhoneInput
            country={'br'}
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
            containerClass="flex bg-[#131313] border-[#323232] rounded-md border"
            inputClass="bg-[#131313] border-none text-[#959CB6]"
            dropdownClass="text-black"
            searchClass="bg-[#131313] border-[#323232] text-[#959CB6]"
            inputStyle={{
              backgroundColor: '#131313',
              color: '#959CB6',
              border: 'none',
              width: '100%',
            }}
          />
          {errors.phone && (
            <Label className="text-red-500">{errors.phone}</Label>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-end gap-5">
        <Button
          onClick={handleUpdateCustomer}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Save Profile
        </Button>

        <DialogClose asChild>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            Close
          </Button>
        </DialogClose>
      </div>
    </div>
  )
}
