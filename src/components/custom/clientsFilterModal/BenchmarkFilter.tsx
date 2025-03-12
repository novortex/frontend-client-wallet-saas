import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BadgeCent } from 'lucide-react'

export function BenchmarkFilter({
  benchmarks,
  selectedBenchmarks,
  handleSelectBenchmark,
  handleRemoveBenchmark,
}: {
  benchmarks: { name: string }[]
  selectedBenchmarks: string[]
  handleSelectBenchmark: (benchmarkName: string) => void
  handleRemoveBenchmark: (benchmarkName: string) => void
}) {
  const handleBenchmarkSelection = (benchmarkName: string) => {
    if (!selectedBenchmarks.includes(benchmarkName)) {
      handleSelectBenchmark(benchmarkName)
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h-[20%] w-full font-bold dark:text-[#959CB6]">
        Filter by benchmark
      </div>
      <div className="flex h-[80%] w-full flex-col items-center justify-center gap-4">
        <div className="flex h-full w-[100%] items-center justify-center gap-2">
          <div className="flex h-full w-[10%] items-center justify-center">
            <BadgeCent className="text-[#D1AB00]" size="lg" />
          </div>
          <div className="flex w-full items-center justify-start">
            <Select onValueChange={handleBenchmarkSelection}>
              <SelectTrigger className="w-full dark:border-[#323232] dark:bg-[#131313] dark:text-[#fff]">
                <SelectValue placeholder="Select benchmarks" />
              </SelectTrigger>
              <SelectContent className="border-2 dark:border-[#323232] dark:bg-[#131313]">
                {benchmarks.map((benchmark, index) => (
                  <SelectItem
                    key={index}
                    value={benchmark.name}
                    className="border-0 dark:bg-[#131313] dark:text-white dark:focus:bg-[#252525] dark:focus:text-white"
                  >
                    <div>{benchmark.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-start justify-start gap-2">
          {selectedBenchmarks.map((benchmarkName, index) => (
            <div
              key={index}
              className="flex h-8 items-center justify-start rounded-md bg-[#959CB6] px-2 text-white"
            >
              <div
                className="mr-2 cursor-pointer"
                onClick={() => handleRemoveBenchmark(benchmarkName)}
              >
                X
              </div>
              <div>{benchmarkName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
