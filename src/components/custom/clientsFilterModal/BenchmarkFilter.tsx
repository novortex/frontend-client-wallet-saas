import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LineChart, X } from 'lucide-react'

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
  const lastBenchmark = selectedBenchmarks.at(-1) ?? ''
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-2">
          <LineChart className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Benchmarks
        </h3>
      </div>
      
      <div className="space-y-3">
        <Select
          value={lastBenchmark}
          onValueChange={handleBenchmarkSelection}
        >
          <SelectTrigger className="w-full border-gray-300 bg-white text-black transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-primary">
            <SelectValue placeholder="Select benchmarks" />
          </SelectTrigger>
          <SelectContent className="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800">
            {benchmarks.map((benchmark, index) => (
              <SelectItem
                key={index}
                value={benchmark.name}
                className="hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700"
              >
                <div>{benchmark.name}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedBenchmarks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedBenchmarks.map((benchmarkName, index) => (
              <div
                key={index}
                className="flex h-8 items-center justify-start rounded-md bg-yellow-600 px-2 text-white hover:bg-yellow-700 transition-colors cursor-pointer"
                onClick={() => handleRemoveBenchmark(benchmarkName)}
              >
                <span className="mr-2">{benchmarkName}</span>
                <X className="h-3 w-3" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
