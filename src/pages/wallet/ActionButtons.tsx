import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HandCoins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TWalletAssetsInfo } from '@/types/wallet.type'

interface ActionButtonsProps {
    walletUuid: string | undefined;
    openOperationModal: () => void;
    openCloseWalletModal: () => void;
    openOrCloseModalRebalanced: () => void;
    infosWallet: TWalletAssetsInfo | undefined;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    walletUuid,
    openOperationModal,
    openCloseWalletModal,
    openOrCloseModalRebalanced,
    infosWallet
}) => {
    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-between mb-10">
            <Input className="bg-[#171717] w-3/4 border-0 text-white focus:ring-0" type="text" placeholder="Search for ..." />
            <div className="flex gap-5">
                <Button className="bg-[#1877F2] w-[45%] hover:bg-blue-600 p-5 gap-2 ml-4" onClick={openOperationModal}>
                    <HandCoins /> Withdrawal / Deposit
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate(`/wallet/${walletUuid}/history`)}>
                    Historic
                </Button>
                <Button type="button" className="bg-[#F2BE38] text-black" onClick={openOrCloseModalRebalanced}>Rebalanced</Button>
                <Button className={`p-5 ${infosWallet?.isClosed ? 'bg-[#10A45C]' : 'bg-[#EF4E3D]'}`} type="button" onClick={openCloseWalletModal}>
                    {infosWallet?.isClosed ? 'Start Wallet' : 'Close Wallet'}
                </Button>
            </div>
        </div>
    );
};

export { ActionButtons }
