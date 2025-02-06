import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
    <div className="w-full flex flex-col gap-2">
      <div className="h-[20%] w-full font-bold text-[#959CB6]">Filter by benchmark</div>
      <div className="h-[80%] w-full flex flex-col items-center justify-center gap-4">
        <div className="h-full w-[100%] flex justify-center gap-2 items-center">
          <div className="h-full w-[10%] flex justify-center items-center">
            <BadgeCent className="text-[#D1AB00]" size="lg" />
          </div>
          <div className="w-full flex items-center justify-start">
            <Select onValueChange={handleBenchmarkSelection}>
              <SelectTrigger className="w-full bg-[#131313] border-[#323232] text-[#fff]">
                <SelectValue placeholder="Select benchmarks" />
              </SelectTrigger>
              <SelectContent className="bg-[#131313] border-2 border-[#323232]">
                {benchmarks.map((benchmark, index) => (
                  <SelectItem key={index} value={benchmark.name} className="bg-[#131313] border-0 focus:bg-[#252525] focus:text-white text-white">
                    <div>{benchmark.name}</div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap justify-start items-start gap-2 w-full">
          {selectedBenchmarks.map((benchmarkName, index) => (
            <div key={index} className="h-8 flex justify-start items-center bg-[#959CB6] text-white rounded-md px-2">
              <div className="cursor-pointer mr-2" onClick={() => handleRemoveBenchmark(benchmarkName)}>
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
