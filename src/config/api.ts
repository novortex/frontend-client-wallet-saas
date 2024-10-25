    import axios from 'axios'

    const url = process.env.VITE_API_URL || 'http://localhost:3000'; 

    export const instance = axios.create({
    baseURL: url,
    withCredentials: true,
    })
