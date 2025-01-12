import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import { getBenchmarkOptions } from '@/services/assetsService'
import { BadgeCent } from 'lucide-react'
import { useState, useEffect } from 'react'

export function BenchmarkFilter({
  uuidOrganization,
  selectedBenchmark,
  handleBenchmarkChange,
}: {
  uuidOrganization: string
  selectedBenchmark: string
  handleBenchmarkChange: (value: string) => void
}) {
  const [benchmarks, setBenchmarks] = useState<string[]>([])

  useEffect(() => {
    const fetchBenchmarks = async () => {
      try {
        const result = await getBenchmarkOptions(uuidOrganization)
        if (result) {
          setBenchmarks(result.map((benchmark) => benchmark.name))
        }
      } catch (error) {
        console.error('Erro ao carregar os benchmarks:', error)
      }
    }

    fetchBenchmarks()
  }, [uuidOrganization])

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-[20%] w-full font-bold text-[#959CB6]">
        Filter by benchmark
      </div>
      <div className="h-[80%] w-full flex flex-col items-center justify-center gap-4">
        <div className="h-full w-[100%] flex justify-center gap-2 items-center">
          <div className="h-full w-[10%] flex justify-center items-center">
            <BadgeCent className="text-[#D1AB00]" size="ls" />
          </div>
          <div className="w-full flex items-center justify-start">
            <Select
              value={selectedBenchmark}
              onValueChange={handleBenchmarkChange}
            >
              <SelectTrigger className="w-full bg-[#131313] border-[#323232] text-[#fff]">
                <SelectValue placeholder="Select benchmark" />
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-2 border-[#323232]">
                {benchmarks.length > 0 ? (
                  benchmarks.map((benchmark) => (
                    <SelectItem
                      key={benchmark}
                      className="bg-[#131313] border-0 focus:bg-[#252525] focus:text-white text-white"
                      value={benchmark}
                    >
                      {benchmark}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem
                    className="bg-[#131313] border-0 text-white"
                    value="loading"
                  >
                    Loading benchmarks...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
