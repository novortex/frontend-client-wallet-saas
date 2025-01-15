import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { getExchangesDisposables } from '@/services/assetsService'
import { BadgeCent } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ExchangeFilter({
  uuidOrganization,
  selectedExchange,
  handleExchangeChange,
}: {
  uuidOrganization: string
  selectedExchange: string
  handleExchangeChange: (value: string) => void
}) {
  const [exchanges, setExchanges] = useState<string[]>([])

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const result = await getExchangesDisposables(uuidOrganization)
        if (result) {
          setExchanges(result.map((exchange) => exchange.name))
        }
      } catch (error) {
        console.error('Erro ao carregar as exchanges:', error)
      }
    }

    fetchExchanges()
  }, [uuidOrganization])

  const handleExchangeSelection = (exchange: string) => {
    if (selectedExchange !== exchange) {
      handleExchangeChange(exchange)
    }
  }

  const handleRemoveExchange = () => {
    handleExchangeChange('')
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-[20%] w-full font-bold text-[#959CB6]">
        Filter by exchange
      </div>
      <div className="h-[80%] w-full flex flex-col items-center justify-center gap-4">
        <div className="h-full w-[100%] flex justify-center gap-2 items-center">
          <div className="h-full w-[10%] flex justify-center items-center">
            <BadgeCent className="text-[#D1AB00]" size="ls" />
          </div>
          <div className="w-full flex items-center justify-start">
            <Select
              value={selectedExchange}
              onValueChange={handleExchangeSelection}
            >
              <SelectTrigger className="w-full bg-[#131313] border-[#323232] text-[#fff]">
                <SelectValue placeholder="Select exchange" />
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-2 border-[#323232]">
                {exchanges.length > 0 ? (
                  exchanges.map((exchange, index) => (
                    <SelectItem
                      key={index}
                      value={exchange}
                      className="bg-[#131313] border-0 focus:bg-[#252525] focus:text-white text-white"
                    >
                      {exchange}
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
          </div>
        </div>
        {selectedExchange && (
          <div className="flex flex-wrap justify-start items-start gap-2 w-full">
            <div className="h-8 flex justify-start items-center bg-[#959CB6] text-white rounded-md px-2">
              <div
                className="cursor-pointer mr-2"
                onClick={handleRemoveExchange}
              >
                X
              </div>
              <div>{selectedExchange}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
