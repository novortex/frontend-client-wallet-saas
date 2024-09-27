import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// create a type for props
type TCardDashboard = {
  title: string
  data: string
}
export function CardDashboard({ title, data }: TCardDashboard) {
  return (
    <Card className="bg-[#131313] border-0 w-1/5">
      <CardHeader>
        <CardTitle className="text-lg text-[#959CB6] font-medium">
          {title || '-'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl text-white font-medium">{data || '-'}</h1>
      </CardContent>
    </Card>
  )
}
