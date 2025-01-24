import { Loading } from '@/components/custom/loading'
import { useAuth } from '@/contexts/authContext'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

export function ProtectedRouteWrapper() {
  const { token } = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (token) {
      setIsReady(true)
    }
  }, [token])

  if (!isReady) {
    return <Loading />
  }

  return <Outlet />
}
