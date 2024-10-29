import '@testing-library/jest-dom'
import dotenv from 'dotenv'

dotenv.config()

process.env.VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:5173'
