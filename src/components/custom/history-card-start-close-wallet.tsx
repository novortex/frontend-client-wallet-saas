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
  const borderStyle = walletState
    ? 'border-[#23CE20]'
    : 'border-[#C81C1C]'
  const walletTitle = walletState
    ? 'Start Wallet'
    : 'Close Wallet'
  const walletValue = walletState
    ? 'Intial Value'
    : 'Invested Value'
  const { data } = data_

  const handleExport = async () => {
    await downloadPdf(
      data.client_name,
      data.start_date,
      data.start_date_formated,
      data.close_date,
      data.close_date_formated,
      String(
        data.invested_amount_in_organization_fiat
      ),
      data.benchmark,
      String(data.company_comission),
      String(data.total_commision),
      data.dollar_value,
      String(data.benchmark_price_start.amount),
      String(data.benchmark_price_end.amount),
      String(data.benchmark_value),
      String(
        data.close_wallet_value_in_organization_fiat
      ),
      String(data.benchmark_exceeded_value),
      data.assets
    )
  }

  return (
    <Card
      className={`${borderStyle} rounded-[12px] border bg-[#131313] w-1/3`}
    >
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-3xl text-[#fff]">
          {walletTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <CardDescription className="flex flex-row gap-2 text-lg">
          Date:
          <p className="text-[#fff]">
            {date} ({hour})
          </p>
        </CardDescription>
        <CardDescription className="flex flex-row gap-2 text-lg">
          {walletValue}:{' '}
          <p className="text-[#fff]">
            {initialValue}
          </p>
        </CardDescription>
        {!walletState && (
          <CardDescription className="flex flex-row gap-2 text-lg">
            Close Value:{' '}
            <p className="text-[#fff]">
              {closeValue}
            </p>
          </CardDescription>
        )}
        {!walletState && (
          <Button
            onClick={handleExport}
            className="bg-white text-black"
          >
            Export
          </Button>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
