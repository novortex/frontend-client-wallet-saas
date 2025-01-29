import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'

interface CardCloseWalletProps {
  description: string
  value: number
  tagValue: number
  tagDescription: string
  tagColor1: number
  tagColor2?: boolean
  value2?: number
}

export default function CardCloseWallet({
  description,
  value,
  tagValue,
  tagDescription,
  tagColor1,
  tagColor2,
  value2,
}: CardCloseWalletProps) {
  let tagBgColor1 = ''
  switch (tagColor1) {
    case 1:
      tagBgColor1 = 'bg-[#10A45C]'
      break
    case 2:
      tagBgColor1 = 'bg-[#EF4E3D]'
      break
    case 3:
      tagBgColor1 = 'bg-[#1877F2]'
      break
    case 4:
      tagBgColor1 = 'bg-[#F1BA00]'
      break
    default:
      tagBgColor1 = 'bg-[#333333]'
      break
  }

  const tagBgColor2 = tagColor2
    ? 'bg-[#F28E13]'
    : 'hidden'

  return (
    <Card className="w-[32%] bg-[#1c1c1c] border-[#323232]">
      <CardHeader>
        <CardDescription className="text-[#959CB6]">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-[#fff]">
          U$ {value}
        </CardTitle>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <div
          className={`w-[90%] ${tagBgColor1} text-start p-1 rounded-2xl text-[#fff]`}
        >
          <p className="ml-2">
            {tagValue}% {tagDescription}
          </p>
        </div>
        {tagColor2 && value2 !== undefined && (
          <div
            className={`w-[95%] ${tagBgColor2} text-start p-1 rounded-2xl text-[#fff]`}
          >
            <p className="ml-2">
              {value2}% OF COMMISSION VALUE
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
