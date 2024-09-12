import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  EyeOffIcon,
  MoreHorizontal,
  PencilIcon,
  TriangleAlert,
  StepForward,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomersOrganization } from './columns'
import CreateWalletModal from '../../create-wallet-modal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function CellActions({
  rowInfos,
}: {
  rowInfos: CustomersOrganization
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white border-0 text-black"
        align="center"
      >
        <div className="flex flex-col">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex justify-center gap-3 border-b border-[#D4D7E3] hover:bg-black hover:text-white"
                variant="secondary"
              >
                <PencilIcon className="w-5" /> Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C1C1C] border-0 text-white max-w-fit">
              <DialogHeader>
                <DialogTitle className="text-white text-3xl">
                  Customer edit
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="Profile">
                <TabsList className="flex justify-between gap-5 bg-[#1C1C1C]">
                  <TabsTrigger
                    className="w-1/2 bg-[#171717] text-[#F2BE38]  data-[state=active]:bg-yellow-500"
                    value="Profile"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-1/2 bg-[#171717] text-[#F2BE38] data-[state=active]:bg-yellow-500"
                    value="Wallet"
                  >
                    Wallet
                  </TabsTrigger>
                </TabsList>
                <TabsContent className="mt-10" value="Profile">
                  <div className="grid justify-items-center grid-cols-2 gap-5">
                    <div>
                      <Label className="ml-2" htmlFor="Name">
                        Name
                      </Label>
                      <Input
                        className="bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="Name"
                        id="Name"
                        placeholder="Name"
                      />
                    </div>

                    <div>
                      <Label className="ml-2" htmlFor="ID">
                        ID
                      </Label>
                      <Input
                        className=" bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="ID"
                        id="ID"
                        placeholder="ID"
                      />
                    </div>
                    <div>
                      <Label className="ml-2" htmlFor="email">
                        Email
                      </Label>
                      <Input
                        className=" bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="email"
                        id="email"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <Label className="ml-2" htmlFor="Phone">
                        Phone
                      </Label>
                      <Input
                        className=" bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="Phone"
                        id="Phone"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent className="mt-10" value="Wallet">
                  <div className="grid justify-items-center grid-cols-2 gap-5">
                    <div>
                      <Label className="ml-2" htmlFor="Name">
                        Exchange
                      </Label>
                      <Input
                        className="bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="Name"
                        id="Name"
                        placeholder="Name"
                      />
                    </div>

                    <div>
                      <Label className="ml-2" htmlFor="ID">
                        Email Password
                      </Label>
                      <Input
                        className=" bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="ID"
                        id="ID"
                        placeholder="ID"
                      />
                    </div>
                    <div>
                      <Label className="ml-2" htmlFor="email">
                        Email ( Exchage )
                      </Label>
                      <Input
                        className=" bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="email"
                        id="email"
                        placeholder="Email"
                      />
                    </div>
                    <div>
                      <Label className="ml-2" htmlFor="Phone">
                        Exchange Password
                      </Label>
                      <Input
                        className=" bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="Phone"
                        id="Phone"
                        placeholder="Phone"
                      />
                    </div>

                    <div>
                      <Label className="ml-2" htmlFor="Phone">
                        Manager
                      </Label>
                      <Input
                        className=" bg-[#131313] border-[#323232] text-[#959CB6]"
                        type="Phone"
                        id="Phone"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Close
                  </Button>
                </DialogClose>
                <Button className="bg-green-500 hover:bg-green-600 text-black">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {rowInfos.isWallet === false ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="flex justify-center gap-3 hover:bg-black hover:text-white"
                  variant="secondary"
                  onClick={openModal}
                >
                  <StepForward className="w-5" /> Continue
                </Button>
              </DialogTrigger>
            </Dialog>
          ) : null}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="flex justify-center gap-3 hover:bg-black hover:text-white"
                variant="secondary"
              >
                <EyeOffIcon className="w-5" /> Disable
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1C1C1C] border-0 text-white">
              <DialogHeader>
                <DialogTitle className="flex gap-5 items-center mb-5">
                  Disabled asset{' '}
                  <TriangleAlert className="text-yellow-400 w-5" />
                </DialogTitle>
                <DialogDescription>
                  Disabled the for all wallets
                  <p className="mt-5 font-bold text-yellow-200">
                    Warning: You are about to disable this crypto asset for all
                    wallets. This action is irreversible and will affect all
                    users holding this asset. Please confirm that you want to
                    proceed with this operation.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="bg-red-500 hover:bg-red-600 text-white">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  disabled
                  className="bg-blue-500 hover:bg-blue-600 text-black"
                >
                  Disabled
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DropdownMenuContent>
      <CreateWalletModal
        rowInfos={rowInfos}
        onClose={closeModal}
        isOpen={isModalOpen}
      />
    </DropdownMenu>
  )
}
