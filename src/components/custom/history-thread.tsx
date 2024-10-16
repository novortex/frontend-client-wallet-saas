import HistoryCardAllocation from './history-card-allocation'
import HistoryCardBuySell from './history-card-buy-sell'
import HistoryCardAddDelete from './history-card-add-delete'
import HistoryCardDepositWithdrawal from './history-card-deposit-withdrawal'
import HistoryCardStartClose from './history-card-start-close-wallet'
import sellIcon from '../../assets/image/history-sell-icon.png'
import buyIcon from '../../assets/image/history-buy-icon.png'
import increaseAllocationIcon from '../../assets/image/history-inc-allocation-icon.png'
import decreaseAllocationIcon from '../../assets/image/history-dec-allocation-icon.png'
import addAssetIcon from '../../assets/image/history-add-asset-icon.png'
import deleteAssetIcon from '../../assets/image/history-delete-asset-icon.png'
import depositIcon from '../../assets/image/history-deposit-icon.png'
import withdrawalIcon from '../../assets/image/history-withdrawal-icon.png'
import startWalletIcon from '../../assets/image/history-start-wallet-icon.png'
import closeWalletIcon from '../../assets/image/history-close-wallet-icon.png'
import { HistoricEntry } from '@/pages/history'

interface HistoryThreadProps {
  user: string
  operationType: string
  asset: string
  date: string
  hour: string
  assetIcon: string
  oldValue?: number
  newValue?: number
  addAssetQuantity?: number
  addAssetAllocation?: number
  depositValue?: number
  withdrawalValue?: number
  initialValue?: number
  closeValue?: number
  data: HistoricEntry
}

const getIcon = (operationType: string) => {
  switch (operationType) {
    case 'SELL_ASSET':
      return sellIcon
    case 'BUY_ASSET':
      return buyIcon
    case 'INCREASE_ALLOCATION':
      return increaseAllocationIcon
    case 'DECREASE_ALLOCATION':
      return decreaseAllocationIcon
    case 'ADD_ASSET':
      return addAssetIcon
    case 'DELETE_ASSET':
      return deleteAssetIcon
    case 'DEPOSIT':
      return depositIcon
    case 'WITHDRAWAL':
      return withdrawalIcon
    case 'START_WALLET':
      return startWalletIcon
    case 'CLOSE_WALLET':
      return closeWalletIcon
    default:
      return ''
  }
}

export default function HistoryThread({
  user,
  operationType,
  asset,
  date,
  hour,
  assetIcon,
  oldValue,
  newValue,
  addAssetQuantity,
  addAssetAllocation,
  depositValue,
  withdrawalValue,
  initialValue,
  closeValue,
  data,
}: HistoryThreadProps) {
  const renderOperationDescription = () => {
    switch (operationType) {
      case 'BUY_ASSET':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> performed a buy of{' '}
            <p className="font-bold">{asset}</p> on {date} ({hour}). Before the
            buy:{' '}
            <p className="font-bold text-[#F2BE38]">
              {oldValue} {asset}
            </p>
            , after the buy:{' '}
            <p className="font-bold text-[#8BF067]">
              {newValue} {asset}
            </p>
          </div>
        )
      case 'SELL_ASSET':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> performed a sell of{' '}
            <p className="font-bold">{asset}</p> on {date} ({hour}). Before the
            sell:{' '}
            <p className="font-bold text-[#F2BE38]">
              {oldValue} {asset}
            </p>
            , after the sell:{' '}
            <p className="font-bold text-[#8BF067]">
              {newValue} {asset}
            </p>
          </div>
        )
      case 'INCREASE_ALLOCATION':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> increased the allocation of{' '}
            <p className="font-bold">{asset}</p> on {date} ({hour}) from{' '}
            <p className="text-[#5696F5]">{oldValue}%</p> to{' '}
            <p className="text-[#5696F5]">{newValue}%</p>
          </div>
        )
      case 'DECREASE_ALLOCATION':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> decreased the allocation of{' '}
            <p className="font-bold">{asset}</p> on {date} ({hour}) from{' '}
            <p className="text-[#5696F5]">{oldValue}%</p> to{' '}
            <p className="text-[#5696F5]">{newValue}%</p>
          </div>
        )
      case 'ADD_ASSET':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p>{' '}
            <p className="text-[#7DE44C]">added</p>{' '}
            <p className="font-bold">{addAssetQuantity}</p> of{' '}
            <p className="font-bold">{asset}</p> on {date} ({hour}) with a{' '}
            <p className="font-bold">
              target allocation of {addAssetAllocation}%
            </p>
          </div>
        )
      case 'DELETE_ASSET':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p>{' '}
            <p className="text-[#F23F3F]">deleted</p>{' '}
            <p className="font-bold">{asset}</p> on {date} ({hour})
          </div>
        )
      case 'DEPOSIT':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> made a deposit on {date} ({hour}
            )
          </div>
        )
      case 'WITHDRAWAL':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> performed a withdrawal on {date}{' '}
            ({hour})
          </div>
        )
      case 'START_WALLET':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> started wallet on {date} ({hour}
            )
          </div>
        )
      case 'CLOSE_WALLET':
        return (
          <div className="flex flex-row gap-1.5">
            <p className="font-bold">{user}</p> closed wallet on {date} ({hour})
          </div>
        )
      default:
        return (
          <div className="flex flex-row text-[#fff]">
            Operação não identificada
          </div>
        )
    }
  }

  const renderHistoryCard = () => {
    switch (operationType) {
      case 'BUY_ASSET':
      case 'SELL_ASSET':
        return (
          <>
            <HistoryCardBuySell
              assetIcon={assetIcon}
              quantity={oldValue ?? 0}
              tagState={false}
            />
            <HistoryCardBuySell
              assetIcon={assetIcon}
              quantity={newValue ?? 0}
              tagState={true}
            />
          </>
        )
      case 'INCREASE_ALLOCATION':
      case 'DECREASE_ALLOCATION':
        return (
          <>
            <HistoryCardAllocation
              assetIcon={assetIcon}
              allocation={oldValue ?? 0}
              tagState={false}
            />
            <HistoryCardAllocation
              assetIcon={assetIcon}
              allocation={newValue ?? 0}
              tagState={true}
            />
          </>
        )
      case 'ADD_ASSET':
        return (
          <HistoryCardAddDelete
            asset={asset}
            assetIcon={assetIcon}
            quantity={addAssetQuantity ?? 0}
            targetAllocation={addAssetAllocation ?? 0}
            operation={true}
          />
        )
      case 'DELETE_ASSET':
        return (
          <HistoryCardAddDelete
            asset={asset}
            assetIcon={assetIcon}
            quantity={0}
            targetAllocation={0}
            operation={false}
          />
        )
      case 'DEPOSIT':
        return (
          <HistoryCardDepositWithdrawal
            quantity={depositValue ?? 0}
            operation={false}
          />
        )
      case 'WITHDRAWAL':
        return (
          <HistoryCardDepositWithdrawal
            quantity={withdrawalValue ?? 0}
            operation={true}
          />
        )
      case 'START_WALLET':
        return (
          <HistoryCardStartClose
            walletState={true}
            date={date}
            hour={hour}
            initialValue={Number(initialValue?.toFixed(2)) ?? 0}
            data_={data}
          />
        )
      case 'CLOSE_WALLET':
        return (
          <HistoryCardStartClose
            walletState={false}
            date={date}
            hour={hour}
            initialValue={Number(initialValue?.toFixed(2)) ?? 0}
            closeValue={Number(closeValue?.toFixed(2)) ?? 0}
            data_={data}
          />
        )
      default:
        return <div className="text-[#fff]">Operação não identificada</div>
    }
  }

  return (
    <div className="flex flex-col gap-3 mb-20">
      <div className="flex flex-row items-center gap-3 text-lg text-[#fff]">
        <img className="w-[3%] h-full" src={getIcon(operationType)} alt="" />
        <p className="w-[97%] h-full">{renderOperationDescription()}</p>
      </div>
      <div className="flex flex-row gap-3">
        <div className="h-full w-[3%] flex items-center justify-center"></div>
        <div className="h-full w-[97%] flex flex-row items-center justify-start gap-10">
          {renderHistoryCard()}
        </div>
      </div>
    </div>
  )
}
