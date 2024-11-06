import { useUserStore } from '@/store/user'
import { login } from '@/services/authService'

export function useLogin() {
  const [setUser] = useUserStore((state) => [state.setUser])

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password)

    if (result) {
      setUser({
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        imageUrl: '',
        uuidOrganization: result.user.uuidOrganizations,
      })

      return { success: true }
    } else {
      return { success: false }
    }
  }

  return { handleLogin }
}
