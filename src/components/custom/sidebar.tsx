import { ChevronLeft, ChevronRight, MoreVertical, Bell } from 'lucide-react'
import LogoOrg from '../../assets/image/vault-logo.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ReactNode, useContext, useState, createContext } from 'react'

// TODO: Refact this component -> separate files and context
type SideBarContextProps = {
  expanded: boolean
}

const SideBarContext = createContext<SideBarContextProps | null>({
  expanded: true,
})

export function SideBar({
  children,
  alerts,
}: {
  children: ReactNode
  alerts: number
}) {
  const [expanded, setExpanded] = useState(true)
  return (
    <aside className={`h-screen ${expanded ? 'w-1/6' : 'w-20'}`}>
      <nav
        className={`h-full fixed flex flex-col bg-[#171717] shadow-sm transition-all ${expanded ? 'w-1/6' : 'w-20'}`}
      >
        <div className="flex gap-5 items-center relative mt-5 mb-5">
          <img src={LogoOrg} className="w-16" alt="" />
          <div
            className={`overflow-hidden transition-all  ${expanded ? 'w-16' : 'w-0'}`}
          >
            <h2 className="text-white font-semibold">Vault</h2>
            <p className="text-[#959CB6] text-sm">Dashboard</p>
          </div>
          <button
            onClick={() => setExpanded((state) => !state)}
            className="p-1.5 rounded-lg bg-[#131313] text-[#959CB6] absolute border -right-5"
          >
            {expanded ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <SideBarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <li
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors text-white mb-10`}
            >
              <Bell size={20} />
              <p
                className={`ml-3 font-normal overflow-hidden transition-all  ${expanded ? 'w-52 ' : 'w-0'}`}
              >
                Notifications
              </p>

              {alerts !== 0 && (
                <div
                  className={`bg-[#F2BE38] text-black w-5 h-5 text-center overflow-hidden transition-all  ${expanded ? 'w-52 ' : 'w-0'}`}
                >
                  {alerts}
                </div>
              )}
            </li>

            {children}
          </ul>
        </SideBarContext.Provider>

        <div className="flex p-3 bg-[#272727]">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="flex justify-between items-center ml-3 w-full">
              <div className="leading-4">
                <p className="font-normal text-white">Abner Silva Barbosa</p>
                <span className="text-sx text-[#959CB6]">Admin</span>
              </div>
              <MoreVertical color="white" />
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

// TODO create a type for props
export function SideBarItem({
  icon,
  text,
  active,
  alert,
}: {
  icon: ReactNode
  text: string
  active?: boolean
  alert?: boolean
}) {
  const context = useContext(SideBarContext)

  if (!context) {
    throw new Error('SideBarItem must be used within a SideBar')
  }

  const { expanded } = context

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium text-[#959CB6] rounded-md cursor-pointer transition-colors group hover:bg-[#F2BE38] hover:text-black ${!expanded ? 'justify-center' : ''} ${active ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800' : ''}`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}
      >
        {text}
      </span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400`}></div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-yellow-300 text-black text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  )
}
