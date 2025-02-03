import { useState } from 'react'

export function useWalletModals() {
  const [isOperationModalOpen, setIsOperationModalOpen] = useState(false)
  const [isCloseWalletModalOpen, setIsCloseWalletModalOpen] = useState(false)
  const [isModalRebalance, setIsModalRebalance] = useState(false)

  const openOperationModal = () => setIsOperationModalOpen(true)
  const closeOperationModal = () => setIsOperationModalOpen(false)

  const openCloseWalletModal = () => setIsCloseWalletModalOpen(true)
  const closeCloseWalletModal = () => setIsCloseWalletModalOpen(false)

  const openOrCloseModalRebalanced = () => setIsModalRebalance((prev) => !prev)

  return {
    isOperationModalOpen,
    openOperationModal,
    closeOperationModal,
    isCloseWalletModalOpen,
    openCloseWalletModal,
    closeCloseWalletModal,
    isModalRebalance,
    openOrCloseModalRebalanced,
  }
}
