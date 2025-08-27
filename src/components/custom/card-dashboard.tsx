import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// create a type for props
type TCardDashboard = {
  title: string
  data: string | number
}
export function CardDashboard({ title, data }: TCardDashboard) {
  return (
    <Card className="bg-card border-border hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title || '-'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold text-foreground">{data || '-'}</p>
      </CardContent>
    </Card>
  )
}
