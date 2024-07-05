import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import * as React from "react"
import RelateClientModal from "./relate-client-modal"

interface AddNewClientModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddNewClientModal({ isOpen, onClose }: AddNewClientModalProps) {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [cpf, setCpf] = React.useState("")
  const [phone, setPhone] = React.useState("")

  const handleAddClient = () => {
    console.log("Name:", name)
    console.log("Email:", email)
    console.log("CPF", cpf)
    console.log("Phone", phone)

    // Reset the inputs
    setName("")
    setEmail("")
    setCpf("")
    setPhone("")

    onClose()
  }

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
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
              placeholder="CPF (optional)"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            <Input
              className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6]"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5" onClick={() => { handleAddClient(); openModal(); }}>
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
      <RelateClientModal isOpen={isModalOpen} onClose={closeModal} />
    </Dialog>
  )
}
