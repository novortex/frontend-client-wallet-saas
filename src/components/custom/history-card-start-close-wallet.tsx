import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '../ui/button'
import { HistoricEntry } from '@/types/wallet.type'
import { downloadPdf } from '@/services/managementService'

interface HistoryCardStartCloseProps {
  walletState: boolean
  date: string
  hour: string
  initialValue: number
  closeValue?: number
  data_: HistoricEntry
}

export default function HistoryCardStartClose({
  walletState,
  date,
  hour,
  initialValue,
  closeValue,
  data_,
}: HistoryCardStartCloseProps) {
  const borderStyle = walletState ? 'border-[#23CE20]' : 'border-[#C81C1C]'
  const walletTitle = walletState ? 'Start Wallet' : 'Close Wallet'
  const walletValue = walletState ? 'Intial Value' : 'Invested Value'
  const { data } = data_

  const handleExport = async () => {
    // Função para formatar números com 2 casas decimais
    const formatNumber = (value: number | string): string => {
      const num = typeof value === 'string' ? parseFloat(value) : value
      return isNaN(num) ? String(value) : num.toFixed(2)
    }

    await downloadPdf(
      data.client_name,
      data.start_date,
      data.start_date_formated,
      data.close_date,
      data.close_date_formated,
      formatNumber(data.invested_amount_in_organization_fiat),
      data.benchmark,
      formatNumber(data.wallet_performance_fee),
      formatNumber(data.company_commission),
      formatNumber(data.total_commision),
      data.dollar_value,
      formatNumber(data.benchmark_price_start),
      formatNumber(data.benchmark_price_end),
      formatNumber(data.benchmark_performance),
      formatNumber(data.benchmark_value),
      formatNumber(data.close_wallet_value_in_organization_fiat),
      formatNumber(data.total_wallet_profit_percent),
      formatNumber(data.benchmark_exceeded_value),
      data.assets.map((asset) => ({
        name: asset.name,
        allocation: parseFloat(asset.allocation.toFixed(2)),
      })),
    )
  }

  return (
    <Card
      className={`${borderStyle} w-1/3 rounded-[12px] border bg-lightComponent dark:bg-[#131313]`}
    >
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="text-3xl text-black dark:text-[#fff]">
          {walletTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <CardDescription className="flex flex-row gap-2 text-lg">
          Date:
          <p className="text-black dark:text-[#fff]">
            {date} ({hour})
          </p>
        </CardDescription>
        <CardDescription className="flex flex-row gap-2 text-lg">
          {walletValue}:{' '}
          <p className="text-black dark:text-[#fff]">{initialValue}</p>
        </CardDescription>
        {!walletState && (
          <CardDescription className="flex flex-row gap-2 text-lg">
            Close Value:{' '}
            <p className="text-black dark:text-[#fff]">{closeValue}</p>
          </CardDescription>
        )}
        {!walletState && (
          <Button onClick={handleExport} className="bg-white text-black">
            Export
          </Button>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
