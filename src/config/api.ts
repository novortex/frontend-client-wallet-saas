import axios from 'axios'
import { toast } from '@/components/ui/use-toast'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

// Adiciona o interceptor de resposta para tratar erros globalmente
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se for erro de autenticação
    if (error.response?.status === 401) {
      toast({
        className: 'bg-red-500 border-0 text-white',
        title: 'Authentication Error',
        description: 'Please try logging in again.',
      })
    }
    return Promise.reject(error)
  },
)

export const setAuthToken = (token: string | null) => {
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete instance.defaults.headers.common.Authorization
  }
}
