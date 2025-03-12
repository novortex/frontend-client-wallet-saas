import { useState, useEffect } from 'react'

export function Loading() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(storedTheme)
  }, [])

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        theme === 'dark' ? 'bg-black/50' : 'bg-white'
      } backdrop-blur-md`}
    >
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin-clockwise rounded-full border-4 border-transparent border-r-yellow-500 border-t-yellow-500"></div>
        <div
          className={`absolute inset-2 border-4 border-transparent ${
            theme === 'dark'
              ? 'border-b-white border-l-white'
              : 'border-b-black border-l-black'
          } animate-spin-counterclockwise rounded-full`}
        ></div>
      </div>
    </div>
  )
}
