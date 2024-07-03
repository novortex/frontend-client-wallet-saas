import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import infoIcon from "../../assets/image/info.png";
import responsibleIcon from "../../assets/image/responsible-icon.png";
import dateIcon from "../../assets/image/date-icon.png";
import { useNavigate } from 'react-router-dom'

interface CardClientProps {
    name: string;
    responsible: string;
    alerts: number;
    next_reb: string;
    last_reb: string;
}

const getTagAlertColor = (alerts: number) => {
    switch (true) {
        case (alerts >= 1 && alerts <= 3):
            return 'bg-green-500';
        case (alerts >= 4 && alerts <= 6):
            return 'bg-yellow-500';
        case (alerts >= 7 && alerts <= 8):
            return 'bg-orange-500';
        case (alerts >= 9):
            return 'bg-red-500';
        default:
            return 'bg-[#272727]'; 
    }
}

const getTextAlertColor = (alerts: number) => {
    switch (true) {
        case (alerts >= 1 && alerts <= 3):
            return 'text-[#fff]';
        case (alerts >= 4 && alerts <= 6):
            return 'text-[#fff]';
        case (alerts >= 7 && alerts <= 8):
            return 'text-[#fff]';
        case (alerts >= 9):
            return 'text-[#fff]';
        default:
            return 'text-[#f0bc32]'; 
    }
}

export default function CardClient({name, responsible, alerts, next_reb, last_reb}: CardClientProps) {
    const alertColor = getTagAlertColor(alerts);
    const alertTextColor = getTextAlertColor(alerts)

    const navigate = useNavigate()
    const handleCardClick = () => {
      navigate('/clients')
    }

    return (
        <Card className="rounded-[12px] border border-[#272727] bg-[#171717] w-[32%] h-[300px] hover:bg-[#373737] cursor-pointer" onClick={handleCardClick}>
            <CardHeader className='w-full h-1/2 gap-3'>
                <CardTitle className='flex flex-row'>
                    <div className='h-full w-1/2 flex items-center justify-start text-[#fff] text-2xl'>
                        <p>{name}</p>
                    </div>
                    <div className='h-full w-1/2 flex items-center justify-end'>
                        <img src={infoIcon} />
                    </div>
                </CardTitle>
                <CardDescription className='flex flex-row'>
                    <div className='h-full w-1/2 flex items-center justify-start gap-2 text-[#959CB6] text-lg'>
                        <img src={responsibleIcon} />
                        <p>{responsible}</p>
                    </div>
                    <div className='h-full w-1/2 flex items-center justify-end'>
                        <div className={`${alertColor} w-1/2 h-full flex justify-center items-center rounded-[20px] font-bold`}>
                           <p className={`${alertTextColor}`}>{alerts} alerts</p>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className='w-full h-1/2'>
                <div className='flex flex-row h-1/2 w-full'>
                    <div className='flex h-full w-1/2 justify-start items-center text-base gap-2 text-[#fff]'>
                        <img src={dateIcon} />
                        <p>Next rebalancing:</p>
                    </div>
                    <div className='flex h-full w-1/2 justify-end items-center text-base text-[#fff]'>
                        {next_reb}
                    </div>
                </div>
                <div className='flex flex-row h-1/2 w-full'>
                    <div className='flex h-full w-1/2 justify-start items-center text-base gap-2 text-[#fff]'>
                        <img src={dateIcon} />
                        <p>Last rebalancing:</p>
                    </div>
                    <div className='flex h-full w-1/2 justify-end items-center text-base text-[#fff]'>
                        {last_reb}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
