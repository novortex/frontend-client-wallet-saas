import {
  MoreVertical,
  Bell,
  LogOut,
} from 'lucide-react'
import LogoOrg from '../../assets/image/vault-logo.png'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  ReactNode,
  useContext,
  useState,
  createContext,
  useRef,
  useEffect,
} from 'react'
import { useUserStore } from '@/store/user'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type SideBarContextProps = {
  expanded: boolean
}

const SideBarContext =
  createContext<SideBarContextProps | null>({
    expanded: true,
  })

export function SideBar({
  children,
  alerts,
}: {
  children: ReactNode
  alerts: number
}) {
  const [expanded, setExpanded] = useState(false)
  const userInfo = useUserStore(
    (state) => state.user
  )
  const { logout } = useAuth0()

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
    localStorage.removeItem('auth_app_state')
  }
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false)
  const dropdownRef = useRef(false)

  const handleDropdownOpenChange = (
    open: boolean
  ) => {
    setIsDropdownOpen(open)
    dropdownRef.current = open
  }
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        navRef.current &&
        !navRef.current.contains(
          event.target as Node
        ) &&
        !dropdownRef.current
      ) {
        setExpanded(false)
      }
    }

    document.addEventListener(
      'mouseup',
      handleClickOutside
    )
    return () => {
      document.removeEventListener(
        'mouseup',
        handleClickOutside
      )
    }
  }, [])

  const handleNavClick = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    setExpanded(true)
  }

  return (
    <aside
      className={`h-screen ${expanded ? 'w-1/6' : 'w-20'} z-10`}
    >
      <nav
        ref={navRef}
        className={`h-full fixed flex flex-col bg-[#171717] shadow-sm transition-all ${expanded ? 'w-1/6' : 'w-20'}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          if (!dropdownRef.current) {
            setExpanded(false)
          }
        }}
        onClick={handleNavClick}
      >
        <div className="flex gap-5 items-center relative mt-5 mb-5">
          <img
            src={LogoOrg}
            className="w-16"
            alt=""
          />
          <div
            className={`overflow-hidden transition-all ${expanded ? 'w-20' : 'w-0'}`}
          >
            <h2 className="text-white font-semibold">
              Vault
            </h2>
            <p className="text-[#959CB6] text-sm">
              Dashboard
            </p>
          </div>
        </div>

        <SideBarContext.Provider
          value={{ expanded }}
        >
          <ul className="flex-1 px-3">
            <li
              className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors text-white mb-10`}
            >
              <Bell size={20} />
              <p
                className={`ml-3 font-normal overflow-hidden transition-all ${expanded ? 'w-52 ' : 'w-0'}`}
              >
                Notifications
              </p>

              <div
                className={`text-[#F2BE38] h-5 text-center overflow-hidden transition-all ${expanded ? 'w-5' : 'w-0'}`}
              >
                {alerts}
              </div>
            </li>

            {children}
          </ul>
        </SideBarContext.Provider>

        <div className="flex p-3 bg-[#272727]">
          <Avatar>
            <AvatarImage
              src={
                userInfo?.picture ||
                'https://github.com/shadcn.png'
              }
              alt={userInfo?.name || 'Guest'}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="flex justify-between items-center ml-3 w-[80%]">
              <div
                className="leading-4 w-full max-w-[calc(100%-40px)] overflow-hidden"
                style={{
                  display: 'inline-block', // Para garantir comportamento de bloco
                }}
              >
                <p
                  className="font-normal text-white mb-2 truncate"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {userInfo?.name?.split(
                    '@'
                  )[0] || 'Guest'}
                </p>
                <span
                  className="text-xs text-[#959CB6] truncate"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {userInfo?.role || 'User'}
                </span>
              </div>
              <DropdownMenu
                onOpenChange={
                  handleDropdownOpenChange
                }
                open={isDropdownOpen}
              >
                <DropdownMenuTrigger
                  asChild
                  className="flex justify-center items-center w-[25%] h-[100%]"
                >
                  <button className="focus:outline-none">
                    <MoreVertical
                      color="white"
                      className="cursor-pointer hover:text-yellow-300 transition-colors"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 bg-[#272727] border-[#171717]"
                >
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-[#959CB6] focus:text-black focus:bg-yellow-300 cursor-pointer flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}

export function SideBarItem({
  icon,
  text,
  active,
  alert,
  href,
}: {
  icon: ReactNode
  text: string
  active?: boolean
  alert?: boolean
  href: string
}) {
  const navigate = useNavigate()
  const context = useContext(SideBarContext)

  if (!context) {
    throw new Error(
      'SideBarItem must be used within a SideBar'
    )
  }

  const { expanded } = context

  return (
    <li
      onClick={() => navigate(href)}
      className={`relative flex items-center py-2 px-3 my-1 font-medium text-[#959CB6] rounded-md cursor-pointer transition-colors group hover:bg-[#F2BE38] hover:text-black ${!expanded ? 'justify-center' : ''} ${active ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800' : ''}`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400`}
        ></div>
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
