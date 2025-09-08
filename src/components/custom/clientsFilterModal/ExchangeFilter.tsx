import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Building2, X } from 'lucide-react'
export function ExchangeFilter({
  exchanges,
  selectedExchanges,
  handleSelectExchange,
  handleRemoveExchange,
}: {
  exchanges: { name: string }[]
  selectedExchanges: string[]
  handleSelectExchange: (exchangeName: string) => void
  handleRemoveExchange: (exchangeName: string) => void
}) {
  const handleExchangeSelection = (exchangeName: string) => {
    if (!selectedExchanges.includes(exchangeName)) {
      handleSelectExchange(exchangeName)
    }
  }
  const lastExchange = selectedExchanges.at(-1) ?? ''

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Exchanges
        </h3>
      </div>
      
      <div className="space-y-3">
        <Select
          value={lastExchange}
          onValueChange={handleExchangeSelection}
        >
          <SelectTrigger className="w-full border-gray-300 bg-white text-black transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary">
            <SelectValue placeholder="Select exchange" />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
            {exchanges.length > 0 ? (
              exchanges.map((exchange, index) => (
                <SelectItem
                  key={index}
                  value={exchange.name}
                  className="hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
                >
                  {exchange.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem
                disabled
                className="text-gray-500"
                value="not_value"
              >
                No exchanges available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        
        {selectedExchanges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedExchanges.map((exchange) => (
              <div
                key={exchange}
                className="flex h-8 items-center justify-start rounded-md bg-yellow-600 px-2 text-white hover:bg-yellow-700 transition-colors cursor-pointer"
                onClick={() => handleRemoveExchange(exchange)}
              >
                <span className="mr-2">{exchange}</span>
                <X className="h-3 w-3" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
