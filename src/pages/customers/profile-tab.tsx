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
            className="bg-[#1C1C1C] border-[#323232] text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            type="text"
            id="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label className="ml-2" htmlFor="email">
            Email
          </Label>
          <Input
            className="bg-[#1C1C1C] border-[#323232] text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label className="ml-2" htmlFor="Phone">
            Phone
          </Label>
          <Input
            className="bg-[#1C1C1C] border-[#323232] text-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            type="tel"
            id="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            required
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
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
