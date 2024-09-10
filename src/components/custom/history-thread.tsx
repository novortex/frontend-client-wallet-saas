import HistoryCardAllocation from './history-card-allocation'
import HistoryCardBuySell from './history-card-buy-sell'
import HistoryCardAddDelete from './history-card-add-delete'
import tIcon from '../../assets/image/t-icon.png'
import bitcoinIcon from '../../assets/image/bitcoin-icon.png'

interface HistoryThreadProps {
  user: string
  operationType: string
  active: string
  date: string
  hour: string
  oldValue: number
  newValue: number
}

export default function HistoryThread({
  user,
  operationType,
  active,
  date,
  hour,
  oldValue,
  newValue,
}: HistoryThreadProps) {
  console.log('jambers')
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row items-center gap-3 text-lg text-[#fff]">
        <img className="w-[3%] h-full" src={tIcon} alt="" />
        <p className="w-[97%] h-full">
          {user} performed a {operationType} of {active} on {date} ({hour}).
          Before the {operationType}: {oldValue} {active}, after {operationType}
          : {newValue} {active}
        </p>
      </div>
      <div className="flex flex-row gap-3">
        <div className="h-full w-[3%] flex items-center justify-center">
          {/* <div className="h-full w-[5%] bg-[gray]">a</div> */}
        </div>
        <div className="h-full w-[97%] flex flex-row items-center justify-start gap-10">
          <HistoryCardBuySell
            assetIcon={bitcoinIcon}
            quantity={200}
            tagState={false}
          />
          <HistoryCardAllocation
            assetIcon={bitcoinIcon}
            allocation={30}
            tagState={true}
          />
          <HistoryCardAddDelete
            asset="Bitcoin"
            assetIcon={bitcoinIcon}
            quantity={15}
            targetAllocation={70}
            operation={false}
          />
        </div>
      </div>
    </div>
  )
}
