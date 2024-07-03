import CardClient from "@/components/custom/card-client"
import SwitchTheme from "@/components/custom/switch-theme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import filterIcon from "../assets/image/filter-lines.png" 

export default function Clients(){
    const users = [
        {
            name: "Arthur Fraige",
            responsible: "Abner Silva",
            alerts: 4,
            nreb: "02/07/2024",
            lreb: "01/07/2024"
        },
        {
            name: "Beatriz Oliveira",
            responsible: "Carla Mendes",
            alerts: 3,
            nreb: "30/06/2024",
            lreb: "29/06/2024"
        },
        {
            name: "Carlos Souza",
            responsible: "Débora Lima",
            alerts: 5,
            nreb: "28/06/2024",
            lreb: "27/06/2024"
        },
        {
            name: "Daniela Santos",
            responsible: "Eliane Rocha",
            alerts: 2,
            nreb: "25/06/2024",
            lreb: "24/06/2024"
        },
        {
            name: "Eduardo Pereira",
            responsible: "Fátima Costa",
            alerts: 6,
            nreb: "22/06/2024",
            lreb: "21/06/2024"
        },
        {
            name: "Eduardo Pereira",
            responsible: "Fátima Costa",
            alerts: 6,
            nreb: "22/06/2024",
            lreb: "21/06/2024"
        },
        {
            name: "Eduardo Pereira",
            responsible: "Fátima Costa",
            alerts: 8,
            nreb: "22/06/2024",
            lreb: "21/06/2024"
        },
        {
            name: "Eduardo Pereira",
            responsible: "Fátima Costa",
            alerts: 10,
            nreb: "22/06/2024",
            lreb: "21/06/2024"
        }
    ];

    return(
        <div className="p-10">
            <div className="mb-10 flex items-center justify-between">
                <h1 className="text-2xl text-white font-medium">Clients</h1>
                <SwitchTheme />
            </div>
            <div className="flex items-center justify-between mb-20">
                <Input
                className="bg-[#171717] w-5/6 border-0 text-white focus:ring-0"
                type="text"
                placeholder="Search for ..."
                />
                <Button type="button" variant="outline" className="gap-2 hover:bg-gray-700">
                    <img src={filterIcon}/>
                    <p>Filters</p>
                </Button>
                <Button className="bg-[#1877F2] p-5" type="button">
                    + Add New
                </Button>
            </div>
            <div className="w-full flex flex-row flex-wrap gap-8 justify-start">
                {users.map((user, index) => (
                    <CardClient
                        key={index}
                        name={user.name}
                        responsible={user.responsible}
                        alerts={user.alerts}
                        next_reb={user.nreb}
                        last_reb={user.lreb}
                    />
                ))} 
            </div>
        </div>
    )
}