import { Card, CardContent } from '@/components/ui/card'

interface MetricCardProps {
  title: string
  value: string | number
  formatter?: (value: any) => string
}

export function MetricCard({ title, value, formatter }: MetricCardProps) {
  const formattedValue = formatter ? formatter(value) : value.toString()
  
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 font-semibold text-foreground">
              {title}
            </p>
            <p className="text-lg font-bold text-foreground">
              {formattedValue}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}