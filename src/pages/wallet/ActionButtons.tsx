import { Button } from '@/components/ui/button'
import { HandCoins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TWalletAssetsInfo } from '@/types/wallet.type'
import { Label } from '@/components/ui/label'

interface ActionButtonsProps {
  walletUuid: string | undefined
  openOperationModal: () => void
  openCloseWalletModal: () => void
  openOrCloseModalRebalanced: () => void
  infosWallet: TWalletAssetsInfo | undefined
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  walletUuid,
  openOperationModal,
  openCloseWalletModal,
  openOrCloseModalRebalanced,
  infosWallet,
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between mb-10">
      <Label className="text-2xl text-white">{infosWallet?.ownerName}</Label>
      <div className="flex gap-5">
        <Button className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600" onClick={openOperationModal}>
          <HandCoins /> Withdrawal / Deposit
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate(`/wallet/${walletUuid}/history`)} className=" hover:bg-gray-400">
          Historic
        </Button>
        <Button type="button" className="bg-[#F2BE38] text-black hover:text-white hover:bg-yellow-600" onClick={openOrCloseModalRebalanced}>
          Rebalanced
        </Button>
        <Button
          className={`p-5 ${infosWallet?.isClosed ? 'bg-[#10A45C] hover:bg-green-700' : 'bg-[#EF4E3D] hover:bg-red-600'}`}
          type="button"
          onClick={openCloseWalletModal}
        >
          {infosWallet?.isClosed ? 'Start Wallet' : 'Close Wallet'}
        </Button>
      </div>
    </div>
  )
}

export { ActionButtons }
