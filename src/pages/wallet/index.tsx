import { useParams } from 'react-router-dom'
import { DataTable } from '@/components/custom/wallet/data-table'
import { Header } from './Header'
import { ActionButtons } from './ActionButtons'
import { WalletInfo } from './WalletInfo'
// ***DO NOT DELETE import { TriggerSection } from './TriggerSection'
import OperationsModal from '@/components/custom/wallet/operations'
import ConfirmCloseWalletModal from '@/components/custom/confirm-close-wallet-modal'
import ConfirmRebalanceModal from '@/components/custom/modal/confirm-rebalance-modal'
import { useWallet } from '@/hooks/useWallet'
import { useWalletModals } from '@/hooks/useWalletModals'
import { Loading } from '@/components/custom/loading'
import { createColumns } from '@/components/custom/wallet/columns'

export function Wallet() {
  const { walletUuid } = useParams()
  const { data, infosWallet, loading, fetchData, calculateRebalance } =
    useWallet(walletUuid as string)
  const {
    isOperationModalOpen,
    openOperationModal,
    closeOperationModal,
    isCloseWalletModalOpen,
    openCloseWalletModal,
    closeCloseWalletModal,
    isModalRebalance,
    openOrCloseModalRebalanced,
  } = useWalletModals()

  if (loading) return <Loading />
  if (!infosWallet)
    return (
      <div className="flex h-screen items-center justify-center dark:text-white">
        Error: Wallet information is not available.
      </div>
    )
  else {
    return (
      <div className="h-full bg-white p-10 dark:bg-transparent">
        <Header walletUuid={walletUuid} />
        <ActionButtons
          walletUuid={walletUuid}
          openOperationModal={openOperationModal}
          openCloseWalletModal={openCloseWalletModal}
          openOrCloseModalRebalanced={openOrCloseModalRebalanced}
          infosWallet={infosWallet}
        />
        {infosWallet && <WalletInfo {...infosWallet} />}
        <DataTable
          columns={createColumns(fetchData)}
          data={data}
          walletUuid={walletUuid as string}
          fetchData={fetchData}
          calculateRebalance={calculateRebalance}
        />
        {/* ***DO NOT DELETE <TriggerSection
          isOperationModalOpen={isOperationModalOpen}
          closeOperationModal={closeOperationModal}
          isCloseWalletModalOpen={isCloseWalletModalOpen}
          closeCloseWalletModal={closeCloseWalletModal}
          closeModalState={infosWallet.isClosed}
          isModalRebalance={isModalRebalance}
          openOrCloseModalRebalanced={openOrCloseModalRebalanced}
          fetchData={fetchData}
        /> */}
        <OperationsModal
          isOpen={isOperationModalOpen}
          onClose={closeOperationModal}
          fetchData={fetchData}
        />
        <ConfirmCloseWalletModal
          isOpen={isCloseWalletModalOpen}
          onClose={closeCloseWalletModal}
          startWallet={infosWallet.isClosed}
          fetchData={fetchData}
        />
        <ConfirmRebalanceModal
          isOpen={isModalRebalance}
          onClose={openOrCloseModalRebalanced}
          fetchData={fetchData}
        />
      </div>
    )
  }
}
export { ActionButtons }
