import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "../ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import dropdownArrow from "../../assets/icons/dropdown-arrow.svg" 

type Checked = DropdownMenuCheckboxItemProps["checked"]

interface AddNewWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const Asset = [
  { name: "asset-1" },
  { name: "asset-2" },
  { name: "asset-3" },
]

const Benchmark = [
  { name: "bench-1" },
  { name: "bench-2" },
  { name: "bench-3" },
]

export default function AddNewWalletModal({ isOpen, onClose }: AddNewWalletModalProps) {
  const [selectedAsset, setSelectedAsset] = React.useState("Asset")
  const [selectedBenchmark, setSelectedBenchmark] = React.useState("Benchmark")
  const [entryValue, setEntryValue] = React.useState("")
  const [allocation, setAllocation] = React.useState("")

  const handleAddAsset = () => {
    console.log("Selected Asset:", selectedAsset)
    console.log("Selected Benchmark:", selectedBenchmark)
    console.log("Entry Value:", entryValue)
    console.log("Allocation:", allocation)

    // Reset the dropdowns and inputs
    setSelectedAsset("Asset")
    setSelectedBenchmark("Benchmark")
    setEntryValue("")
    setAllocation("")

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
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6] flex justify-between">
                  {selectedAsset}
                  <img src={dropdownArrow}/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Assets on Organization</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Asset.map((asset) => (
                  <DropdownMenuCheckboxItem key={asset.name} checked={selectedAsset === asset.name} onCheckedChange={() => setSelectedAsset(asset.name)}>
                    {asset.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6]"
              placeholder="Entry value"
              value={entryValue}
              onChange={(e) => setEntryValue(e.target.value)}
            />
          </div>
          <div className="w-full h-1/2 flex flex-row justify-between gap-4 items-center">
            <Input
              className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6]"
              placeholder="Allocation"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-1/2 h-full bg-[#272727] border-[#323232] text-[#959CB6] flex justify-between">
                  {selectedBenchmark}
                  <img src={dropdownArrow}/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Benchmarks on Organization</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Benchmark.map((benchmark) => (
                  <DropdownMenuCheckboxItem key={benchmark.name} checked={selectedBenchmark === benchmark.name} onCheckedChange={() => setSelectedBenchmark(benchmark.name)}>
                    {benchmark.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
