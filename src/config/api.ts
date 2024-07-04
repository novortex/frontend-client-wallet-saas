import axios from 'axios'

// http://localhost:3000/
const url = import.meta.env.VITE_API_URL

export const instance = axios.create({
  baseURL: url,
})
