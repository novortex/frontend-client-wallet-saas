import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

export default function CardCloseWallet(
  description: string,
  value: number,
  tagValue: number,
  tagDescription: string,
  tagColor: number,
) {
  console.log('oi')

  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle>U$ {value}</CardTitle>
      </CardContent>
      <CardFooter>
        <div>
          {tagValue}% from {tagDescription}
        </div>
      </CardFooter>
    </Card>
  )
}
