import { ArrowDown, ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AssetOrgs } from '../columns'

export default function Price({ row }: { row: AssetOrgs }) {
  const price = row.price

  const [prevPrice, setPrevPrice] = useState(price)

  const [highlight, setHighlight] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    if (price !== prevPrice) {
      setHighlight(price > prevPrice ? 'up' : 'down')

      setPrevPrice(price)

      const timer = setTimeout(() => {
        setHighlight(null)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [price, prevPrice])

  return (
    <div
      className={`flex items-center justify-center text-center transition-colors duration-500 ${
        highlight === 'up'
          ? 'text-green-600 dark:text-green-400'
          : highlight === 'down'
            ? 'text-red-600 dark:text-red-400'
            : ''
      }`}
    >
      {highlight === 'up' && (
        <ArrowUp className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
      )}
      {highlight === 'down' && (
        <ArrowDown className="mr-1 h-4 w-4 text-red-600 dark:text-red-400" />
      )}
      {price ? `U$ ${price.toFixed(2)}` : 'N/A'}
    </div>
  )
}
