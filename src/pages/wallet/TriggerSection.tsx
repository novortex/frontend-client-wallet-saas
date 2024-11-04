import { Button } from '@/components/ui/button'
import OperationsModal from '@/components/custom/tables/wallet-client/operations'
import ConfirmCloseWalletModal from '@/components/custom/confirm-close-wallet-modal'
import ConfirmRebalanceModal from '@/components/custom/modal/confirm-rebalance-modal'

interface TriggerSectionInterface {
    isOperationModalOpen: boolean;
    closeOperationModal: () => void;
    isCloseWalletModalOpen: boolean;
    closeCloseWalletModal: () => void;
    closeModalState: boolean;
    isModalRebalance: boolean;
    openOrCloseModalRebalanced: () => void;
}

const TriggerSection: React.FC<TriggerSectionInterface> = ({
    isOperationModalOpen,
    closeOperationModal,
    isCloseWalletModalOpen,
    closeCloseWalletModal,
    closeModalState,
    isModalRebalance,
    openOrCloseModalRebalanced
}) => {
    return (
        <div className='mt-5'>
            <div className="bg-[#171717] rounded-t-lg p-5 flex items-center justify-between ">
                <h1 className="text-white">My Triggers</h1>
                <Button className="bg-[#1877F2] hover:bg-blue-600">Trigger Action</Button>
            </div>
            <OperationsModal isOpen={isOperationModalOpen} onClose={closeOperationModal} />
            <ConfirmCloseWalletModal isOpen={isCloseWalletModalOpen} onClose={closeCloseWalletModal} startWallet={closeModalState} />
            <ConfirmRebalanceModal isOpen={isModalRebalance} onClose={openOrCloseModalRebalanced} />
        </div>
    )
}

export { TriggerSection }
