import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Target, Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BaseWallet } from '@/types/baseWallet.type'

interface CardBaseWalletProps {
  baseWallet: BaseWallet
}

const getRiskProfileDisplayName = (riskProfile: string) => {
  const profiles: Record<string, string> = {
    SUPER_LOW_RISK: 'Super Baixo Risco',
    LOW_RISK: 'Baixo Risco',
    STANDARD: 'Risco Padrão',
    HIGH_RISK: 'Alto Risco',
    SUPER_HIGH_RISK: 'Super Alto Risco',
  }
  return profiles[riskProfile] || riskProfile
}


export default function CardBaseWallet({ baseWallet }: CardBaseWalletProps) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/base-wallets/${baseWallet.uuid}`)
  }

  const totalTargets = baseWallet.TargetAssets?.length || 0
  const totalAllocation = baseWallet.TargetAssets?.reduce(
    (sum, target) => sum + target.idealAllocation,
    0,
  ) || 0

  return (
    <Card
      className="card-wallet h-[200px] w-[100%]"
      onClick={handleCardClick}
    >
      <CardHeader className="px-4 pt-4 pb-1">
        <CardTitle className="flex flex-row items-center gap-3">
          <div className="flex-1">
            <p className="truncate text-2xl text-black dark:text-white">{getRiskProfileDisplayName(baseWallet.riskProfile)}</p>
          </div>
          <div className="relative flex items-center justify-end">
            <div className="group relative">
              <div className="rounded-full bg-primary/10 p-2">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div className="pointer-events-none absolute bottom-full right-full mb-2 w-[1250%] rounded bg-white px-4 py-2 text-start text-sm text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-black dark:text-white">
                {baseWallet.name}
                <br />
                Perfil: {getRiskProfileDisplayName(baseWallet.riskProfile)}
                <br />
                Ativos: {totalTargets}
              </div>
            </div>
          </div>
        </CardTitle>
        <CardDescription className="flex flex-row">
          <div className="flex h-full w-full items-center justify-start gap-2 text-lg text-[#959CB6]">
            <div className="rounded-full bg-primary/10 p-2">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <p>{totalTargets} ativos</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pt-1 pb-4 space-y-1">
        <div className="flex w-full flex-row items-center py-1 gap-2">
          <div className="flex items-center gap-2 text-base text-[#959CB6]">
            <div className="rounded-full bg-primary/10 p-2">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <p>Alocação Total:</p>
            <span>{totalAllocation.toFixed(1)}%</span>
          </div>
        </div>
        <div className="flex w-full flex-row items-center py-1 gap-2">
          <div className="flex items-center gap-2 text-base text-[#959CB6]">
            <div className="rounded-full bg-primary/10 p-2">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p>Ativos:</p>
            <span>{totalTargets}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}