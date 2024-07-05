import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import * as React from "react"

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface AddNewAssetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddNewAssetModal({ isOpen, onClose }: AddNewAssetModalProps) {
  const [assetId, setAssetId] = React.useState("")

  const handleAddAsset = () => {
    console.log("Asset ID:", assetId)

    // Reset the input
    setAssetId("")

    // Close the modal
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-1/3 w-[200%] bg-[#131313] text-[#fff]">
        <DialogHeader>
          <DialogTitle className="text-3xl text-[#fff]">
            New Asset
          </DialogTitle>
        </DialogHeader>
        <div className="w-full flex flex-col gap-4">
          <Input
            placeholder="idCMC"
            className="w-full h-full bg-[#272727] border-[#323232] text-[#959CB6]"
            value={assetId}
            onChange={(e) => setAssetId(e.target.value)}
          />
          <div className="w-full flex flex-row gap-1">
            <p className="text-[#fff]">
                Check the desired asset ID at 
            </p>
            <a className="text-[#1877F2] hover:opacity-70" href="https://coinmarketcap.com/" target="_blank">
                coinmarketcap
            </a>
          </div>
        </div>
        <DialogFooter className="flex justify-end items-end">
          <Button className="bg-[#1877F2] w-1/4 hover:bg-blue-600 p-5" onClick={handleAddAsset}>
            Add asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
