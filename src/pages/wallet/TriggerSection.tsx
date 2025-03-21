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
        <Button className="bg-[#F2BE38] text-black hover:bg-yellow-600 hover:text-white">
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
