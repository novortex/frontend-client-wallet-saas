import { CardDashboard } from '@/components/custom/card-dashboard'
import { TWalletAssetsInfo } from '@/types/wallet.type'
import { formatDate } from '@/utils'

const WalletInfo: React.FC<TWalletAssetsInfo> = ({ startDate, investedAmount, currentAmount, performanceFee, lastRebalance, monthCloseDate }) => (
  <div className="flex gap-5 mb-10">
    <CardDashboard title="Start date" data={startDate ? formatDate(startDate.toString()) : '-'} />
    <CardDashboard title="Invested Amount" data={investedAmount ? Number(investedAmount).toFixed(2) : '-'} />
    <CardDashboard title="Current Amount" data={currentAmount ? Number(currentAmount).toFixed(2) : '-'} />
    <CardDashboard title="Performance fee" data={performanceFee ? Number(performanceFee).toFixed(2) : '-'} />
    <CardDashboard title="Last rebalancing" data={lastRebalance ? formatDate(lastRebalance.toString()) : '-'} />
    <CardDashboard title="Month closing date" data={monthCloseDate ? formatDate(monthCloseDate.toString()) : '-'} />
  </div>
)

export { WalletInfo }
