import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// create a type for props
type TCardDashboard = {
  title: string
  data: string | number
}
export function CardDashboard({ title, data }: TCardDashboard) {
  return (
    <Card className="w-1/5 border bg-lightComponent dark:bg-[#131313]">
      <CardHeader>
        <CardTitle className="text-lg font-medium dark:text-[#959CB6]">
          {title || '-'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl font-medium dark:text-white">{data || '-'}</h1>
      </CardContent>
    </Card>
  )
}
