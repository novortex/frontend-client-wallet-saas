import { Button } from '@/components/ui/button'
import OperationsModal from '@/components/custom/wallet/operations'
import ConfirmCloseWalletModal from '@/components/custom/confirm-close-wallet-modal'
import ConfirmRebalanceModal from '@/components/custom/modal/confirm-rebalance-modal'

interface TriggerSectionInterface {
  isOperationModalOpen: boolean
  closeOperationModal: () => void
  isCloseWalletModalOpen: boolean
  closeCloseWalletModal: () => void
  closeModalState: boolean
  isModalRebalance: boolean
  openOrCloseModalRebalanced: () => void
  fetchData: () => Promise<void>
}

const TriggerSection: React.FC<TriggerSectionInterface> = ({
  isOperationModalOpen,
  closeOperationModal,
  isCloseWalletModalOpen,
  closeCloseWalletModal,
  closeModalState,
  isModalRebalance,
  openOrCloseModalRebalanced,
  fetchData,
}) => {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-200 p-5 dark:bg-[#171717]">
        <h1 className="dark:text-white">My Triggers</h1>
        <Button className="flex items-center gap-2 bg-[#FF4A3A] px-4 font-medium text-black transition-all duration-200 transform hover:scale-105 hover:bg-red-500 hover:text-white">
          Trigger Action
        </Button>
      </div>
      <OperationsModal
        isOpen={isOperationModalOpen}
        onClose={closeOperationModal}
        fetchData={fetchData}
      />
      <ConfirmCloseWalletModal
        isOpen={isCloseWalletModalOpen}
        onClose={closeCloseWalletModal}
        startWallet={closeModalState}
        fetchData={function (): Promise<void> {
          throw new Error('Function not implemented.')
        }}
      />
      <ConfirmRebalanceModal
        isOpen={isModalRebalance}
        onClose={openOrCloseModalRebalanced}
        fetchData={function (): Promise<void> {
          throw new Error('Function not implemented.')
        }}
      />
    </div>
  )
}

export { TriggerSection }
