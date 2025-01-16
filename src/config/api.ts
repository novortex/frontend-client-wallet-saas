// src/config/api.ts
import axios from 'axios'
import { getAccessToken } from './authToken.service'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
})

// Adiciona o token do Auth0 em todas as requisições
instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    } catch (error) {
      console.error('Error getting access token:', error)
      return Promise.reject(error)
    }
  },
  (error) => {
    return Promise.reject(error)
  },
)
