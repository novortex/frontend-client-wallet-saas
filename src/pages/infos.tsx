import SwitchTheme from '@/components/custom/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import exportIcon from '../assets/icons/export.svg'
import {
  CircleAlert,
  Check,
  DollarSign,
  Calendar,
  Wallet,
  BarChartBigIcon,
} from 'lucide-react'
import responsibleIcon from '../assets/image/responsible-icon.png'

export default function Infos() {
  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Infos</h1>
        <SwitchTheme />
      </div>

      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-5/6 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="">
          <Button className="bg-white text-black flex gap-2 hover:bg-gray-400 p-5">
            {' '}
            <img src={exportIcon} alt="" /> Export
          </Button>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex flex-col w-3/5">
          <div className="flex justify-between mb-5">
            <div className="flex gap-5">
              <h1 className="text-3xl text-white">Fernanda Souza</h1>
              <Badge className="bg-[#10A45C] text-white flex gap-2 hover:bg-[#10A45C] hover:text-white">
                {' '}
                <Check className="w-5" /> Confirm contact
              </Badge>
            </div>
            <div>
              <Button className="bg-[#131313] text-[#F2BE38] flex gap-3 hover:bg-yellow-500 hover:text-black">
                {' '}
                <CircleAlert className="w-5" /> Information
              </Button>
            </div>
          </div>

          <div className="mb-14">
            <div className="h-full w-1/2 flex items-center justify-start gap-2 text-[#959CB6] text-xl">
              <img className="w-6" src={responsibleIcon} alt="" />
              <p>Carlos Henrique</p>
            </div>

            <div className="flex text-xl">
              <DollarSign className="text-[#F2BE38]" />
              <p className="text-[#959CB6]">
                10% commission for: Arthur Fraige, Pedro Gattai
              </p>
            </div>
          </div>

          <div className="w-full bg-[#171717] p-10 rounded-xl border border-[#272727]">
            <div className="flex justify-between gap-2 text-[#959CB6] text-xl mb-5">
              <div className="flex items-center gap-5">
                <div className="bg-[#131313] border border-[#221D11] rounded-full p-2">
                  <img className="w-6" src={responsibleIcon} alt="" />
                </div>

                <p className="text-white">Wallet informations</p>
              </div>

              <Badge className="bg-[#F2BE38] text-black flex gap-2 hover:bg-[#F2BE38] hover:text-black p-2 pl-5 pr-5">
                {' '}
                <CircleAlert className="" /> Risk profile
              </Badge>
            </div>

            <div className="w-full p-2 grid grid-cols-2 gap-5 mb-5">
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Initial amount invested: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Current value referring to the benchmark: 0.00
                </p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Current value: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Next rebalancing date: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Performance fee: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Last rebalance date: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Benchmark: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Next monthly closing date: 0.00</p>
              </div>
            </div>

            <div className="bg-[#272727] w-full h-1 rounded-md mb-5"></div>

            <div className="w-full p-2 grid grid-cols-2 gap-5">
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">{`Person's broker:`} 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Initial fee: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">Account information: 0.00</p>
              </div>
              <div className="flex gap-3">
                <Calendar className="text-[#F2BE38]" />
                <p className="text-white">
                  Initial fee was paid or not (checker): 0.00
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-2/5">
          <div className="flex justify-end gap-7 mb-5">
            <div className="bg-[#171717] flex flex-col items-center p-10 rounded-lg">
              <Calendar className="text-[#F2BE38]" />
              <p className="text-white">Prohibited</p>
              <p className="text-[#959CB6]">02/07/2024</p>
            </div>
            <div className="bg-[#171717] flex flex-col items-center p-10 rounded-lg">
              <Calendar className="text-[#F2BE38]" />
              <p className="text-white">Closure</p>
              <p className="text-[#959CB6]">02/07/2024</p>
            </div>
          </div>

          <div className="w-full bg-[#171717] p-10 rounded-xl border border-[#272727] h-full">
            <div className="flex items-center justify-between mb-16">
              <h1 className="text-white text-xl">Alerts</h1>
              <div className="flex gap-5">
                <Button className="bg-[#1877F2] hover:bg-blue-600 flex gap-3 pt-5 pb-5">
                  <Wallet />
                  <p>Filters</p>
                </Button>

                <Button className="bg-[#1877F2] hover:bg-blue-600 flex gap-3 pt-5 pb-5">
                  <BarChartBigIcon />
                  <p>Filters</p>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="bg-[#EF4E3D] w-full p-5 rounded-md">
                <h2>Alert when it happens X</h2>
              </div>
              <div className="bg-[#F1BA00] w-full p-5 rounded-md">
                <h2>Alert when it happens Y</h2>
              </div>
              <div className="bg-[#10A45C] w-full p-5 rounded-md">
                <h2>Alert when it happens Z</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
