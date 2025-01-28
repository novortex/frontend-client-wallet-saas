import { useParams } from 'react-router-dom'
import { DataTable } from '@/components/custom/tables/wallet-client/data-table'
import { Header } from './Header'
import { ActionButtons } from './ActionButtons'
import { WalletInfo } from './WalletInfo'
import { TriggerSection } from './TriggerSection'
import OperationsModal from '@/components/custom/tables/wallet-client/operations'
import ConfirmCloseWalletModal from '@/components/custom/confirm-close-wallet-modal'
import ConfirmRebalanceModal from '@/components/custom/modal/confirm-rebalance-modal'
import { createColumns } from '@/components/custom/tables/wallet-client/columns'
import { useWallet } from '@/hooks/useWallet'
import { useWalletModals } from '@/hooks/useWalletModals'
import { Loading } from '@/components/custom/loading'

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
      <div className="text-white flex justify-center items-center h-screen">
        Error: Wallet information is not available.
      </div>
    )
  else {
    return (
      <div className="p-10">
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
        <TriggerSection
          isOperationModalOpen={isOperationModalOpen}
          closeOperationModal={closeOperationModal}
          isCloseWalletModalOpen={isCloseWalletModalOpen}
          closeCloseWalletModal={closeCloseWalletModal}
          closeModalState={infosWallet.isClosed}
          isModalRebalance={isModalRebalance}
          openOrCloseModalRebalanced={openOrCloseModalRebalanced}
          fetchData={fetchData}
        />
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
