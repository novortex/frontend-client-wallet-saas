import CardClient from '@/components/custom/card-client'
import SwitchTheme from '@/components/custom/switch-theme'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import filterIcon from '../assets/image/filter-lines.png'

export default function Clients() {
  const users = [
    {
      name: 'Arthur Fraige',
      responsible: 'Abner Silva',
      alerts: 4,
      nreb: '02/07/2024',
      lreb: '01/07/2024',
      email: 'arthur.fraige@example.com',
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
    },
    {
      name: 'Beatriz Oliveira',
      responsible: 'Carla Mendes',
      alerts: 3,
      nreb: '30/06/2024',
      lreb: '29/06/2024',
      email: 'beatriz.oliveira@example.com',
      cpf: '',
      phone: '',
    },
    {
      name: 'Carlos Souza',
      responsible: 'Débora Lima',
      alerts: 5,
      nreb: '28/06/2024',
      lreb: '27/06/2024',
      email: 'carlos.souza@example.com',
      cpf: '345.678.901-22',
      phone: '',
    },
  ]

  return (
    <div className="p-10">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl text-white font-medium">Clients</h1>
        <SwitchTheme />
      </div>
      <div className="flex items-center justify-between mb-10">
        <Input
          className="bg-[#171717] w-3/4 border-0 text-white focus:ring-0"
          type="text"
          placeholder="Search for ..."
        />
        <div className="flex gap-5">
          <Button
            type="button"
            variant="outline"
            className="gap-2 hover:bg-gray-700"
          >
            <img src={filterIcon} alt="" />
            <p>Filters</p>
          </Button>
          <Button className="bg-[#1877F2] p-5" type="button">
            + Add New
          </Button>
        </div>
      </div>
      <div className="w-full flex gap-7">
        {users.map((user, index) => (
          <CardClient
            key={index}
            name={user.name}
            responsible={user.responsible}
            alerts={user.alerts}
            next_rebalancing={user.nreb}
            last_rebalancing={user.lreb}
            email={user.email}
            phone={user.phone}
            cpf={user.cpf}
          />
        ))}
      </div>
    </div>
  )
}
