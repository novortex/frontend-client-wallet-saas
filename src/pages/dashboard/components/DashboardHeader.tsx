import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SwitchTheme } from '@/components/custom/switch-theme'

interface DashboardHeaderProps {
  isRefreshing: boolean
  isAllDataLoaded: boolean
  dataQualityRate?: number
  onRefresh: () => void
}

export function DashboardHeader({ 
  isRefreshing, 
  isAllDataLoaded, 
  dataQualityRate,
  onRefresh 
}: DashboardHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              Dashboard Financeiro
            </h1>
            {!isAllDataLoaded && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Análise de desempenho de carteiras de investimento
          </p>
        </div>
        <SwitchTheme />
      </div>

      {/* Seção de ações */}
      <div className="mb-6 flex justify-end">
        <Button 
          onClick={onRefresh} 
          disabled={isRefreshing}
          size="sm"
          className="btn-yellow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isRefreshing ? (
            <>
              <RotateCcw className="h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" />
              Atualizar
            </>
          )}
        </Button>
      </div>

      {/* Data Quality Rate */}
      {dataQualityRate !== undefined && (
        <p className="text-md mb-4 ml-2 font-bold text-muted-foreground">
          Taxa de qualidade dos dados: {dataQualityRate.toFixed(1)}%
        </p>
      )}
    </>
  )
}