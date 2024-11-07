import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type rebalanceModalProps = {
  open: boolean | undefined
  onOpenChange: (open: boolean) => void
}

export function RebalanceModal({ open, onOpenChange }: rebalanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="w-fit bg-[#1C1C1C] border-none border-[20px] p-10 gap-12 flex flex-col items-center justify-center ">
        <DialogHeader>
          <DialogTitle className="text-[#F2BE38] text-center text-[24px]">
            Rebalancing parameters
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-12 w-full items-center">
          <div className="w-full items-center ">
            <Label className="text-left text-white ">Minimum value</Label>
            <Label className="text-[#49454F]"> ( Ex: 100 )</Label>
            <Input
              id="name"
              placeholder="R$"
              className="bg-[#171717] border-solid border-[#272727]"
            />
          </div>
          <div className="w-full items-center gap-4">
            <Label className="text-right text-white">Minimum percentage</Label>
            <Label className="text-[#49454F]"> ( Ex: 20 )</Label>

            <Input
              id="username"
              placeholder="%"
              className=" bg-[#171717] border-solid border-[#272727]"
            />
          </div>
          <Button className="bg-[#F2BE38] hover:bg-[#F2BE38] rounded-[16px] w-[70%] text-[14px] text-black">
            Calc
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
