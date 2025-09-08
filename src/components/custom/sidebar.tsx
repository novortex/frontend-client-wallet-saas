import { MoreVertical, LogOut, ChevronDown } from 'lucide-react'
import LogoOrg from '../../assets/image/vault-logo.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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

const SideBarContext = createContext<SideBarContextProps | null>({
  expanded: true,
})

export function SideBar({
  children,
}: {
  children: ReactNode
}) {
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark'
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const [expanded, setExpanded] = useState(false)
  const userInfo = useUserStore((state) => state.user)
  const { logout } = useAuth0()

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
    localStorage.removeItem('auth_app_state')
  }
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(false)

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open)
    dropdownRef.current = open
  }
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !dropdownRef.current
      ) {
        setExpanded(false)
      }
    }

    document.addEventListener('mouseup', handleClickOutside)
    return () => {
      document.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(true)
  }

  return (
    <aside
      className={`h-screen bg-background dark:bg-sidebar ${expanded ? 'w-1/6' : 'w-9'} z-10`}
    >
      <nav
        ref={navRef}
        className={`fixed flex h-full flex-col border bg-background shadow-sm dark:bg-sidebar ${expanded ? 'w-1/6' : 'w-20'}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          if (!dropdownRef.current) {
            setExpanded(false)
          }
        }}
        onClick={handleNavClick}
      >
        <div
          className={`mb-5 mt-5 flex items-center ${!expanded ? 'justify-center' : 'gap-5'}`}
        >
          <img src={LogoOrg} className="w-16" alt="" />
          {expanded && (
            <div className="w-20 overflow-hidden transition-all">
              <h2 className="font-semibold text-foreground">
                Vault
              </h2>
              <p className="text-sm text-sidebar-foreground">Capital</p>
            </div>
          )}
        </div>

        <SideBarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {children}
          </ul>
        </SideBarContext.Provider>

        <div
          className={`flex border bg-background p-3 text-foreground dark:bg-sidebar-accent ${!expanded ? 'justify-center' : 'justify-start'}`}
        >
          <Avatar>
            <AvatarImage
              src={userInfo?.picture || 'https://github.com/shadcn.png'}
              alt={userInfo?.name || 'Guest'}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="ml-3 flex w-[80%] items-center justify-between">
              <div
                className="w-full max-w-[calc(100%-40px)] overflow-hidden leading-4"
                style={{ display: 'inline-block' }}
              >
                <p
                  className="mb-2 truncate font-normal"
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {userInfo?.name?.split('@')[0] || 'Guest'}
                </p>
                <span className="truncate text-xs text-sidebar-foreground">
                  {userInfo?.role || 'User'}
                </span>
              </div>
              <DropdownMenu
                onOpenChange={handleDropdownOpenChange}
                open={isDropdownOpen}
              >
                <DropdownMenuTrigger
                  asChild
                  className="flex h-[100%] w-[25%] items-center justify-center"
                >
                  <button className="rounded-md hover:bg-muted focus:outline-none dark:hover:bg-sidebar">
                    <MoreVertical className="cursor-pointer text-foreground transition-colors hover:text-sidebar-primary" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-40 border-border bg-popover"
                >
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center text-sidebar-foreground focus:bg-destructive focus:text-destructive-foreground"
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
  iconExpanded,
  text,
  active,
  alert,
  isDropdown = false,
  href,
  children,
}: {
  icon: ReactNode
  iconExpanded?: ReactNode
  text: string
  active?: boolean
  alert?: boolean
  isDropdown?: boolean
  href: string
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const context = useContext(SideBarContext)

  if (!context) {
    throw new Error('SideBarItem must be used within a SideBar')
  }

  const { expanded } = context

  if (isDropdown) {
    return (
      <div>
        <li
          onClick={() => setOpen(!open)}
          className={`group relative my-1 flex cursor-pointer items-center rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-sidebar-primary hover:text-white ${!expanded ? 'justify-center' : ''}`}
        >
          {expanded && iconExpanded ? iconExpanded : icon}
          <span
            className={`overflow-hidden transition-all ${expanded ? 'ml-3 w-52' : 'w-0'}`}
          >
            {text}
          </span>
          <ChevronDown
            className={`transition-transform ${expanded ? 'ml-auto' : 'w-0'} ${open ? 'rotate-180' : ''}`}
            size={16}
          />
        </li>
        {open && expanded && <div className="ml-6">{children}</div>}
      </div>
    )
  }

  return (
    <li
      onClick={() => navigate(href)}
      className={`group relative my-1 flex cursor-pointer items-center rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-sidebar-primary hover:text-white ${!expanded ? 'justify-center' : ''} ${active ? 'bg-sidebar-primary text-white' : ''}`}
    >
      {expanded && iconExpanded ? iconExpanded : icon}
      <span
        className={`overflow-hidden transition-all ${expanded ? 'ml-3 w-52' : 'w-0'}`}
      >
        {text}
      </span>
      {alert && (
        <div className="absolute right-2 h-2 w-2 rounded bg-indigo-400"></div>
      )}

      {!expanded && (
        <div className="invisible absolute left-full ml-6 -translate-x-3 rounded-md bg-sidebar-primary px-2 py-1 text-sm text-white opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100">
          {text}
        </div>
      )}
    </li>
  )
}
