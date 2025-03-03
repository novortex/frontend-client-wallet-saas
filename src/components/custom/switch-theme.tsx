import { useState, useEffect } from 'react'
import moonIcon from '../../assets/icons/moon.svg'
import sunIcon from '../../assets/icons/Union.svg'

export function SwitchTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : true
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center p-1 rounded-md cursor-pointer focus:outline-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 border"
      style={{ backgroundColor: isDarkMode ? '#171717' : '#F7FBFF' }}
    >
      <div
        className={`w-1/2 flex items-center justify-center rounded-full p-1 transition-all duration-300 ease-in-out ${
          !isDarkMode ? 'bg-white' : 'bg-transparent'
        }`}
      >
        <img
          src={sunIcon}
          alt="Light mode"
          className="max-w-[20px] sm:max-w-[25px]"
          style={{
            filter: isDarkMode
              ? 'invert(53%) sepia(32%) saturate(0%) hue-rotate(297deg) brightness(98%) contrast(97%)'
              : 'invert(34%) sepia(7%) saturate(2567%) hue-rotate(334deg) brightness(93%) contrast(92%)',
          }}
        />
      </div>
      <div
        className={`w-1/2 flex items-center justify-center rounded-full p-1 transition-all duration-300 ease-in-out ${
          isDarkMode ? 'bg-[#1C1C1C]' : 'bg-transparent'
        }`}
      >
        <img
          src={moonIcon}
          alt="Dark mode"
          className="max-w-[20px] sm:max-w-[25px]"
          style={{
            filter: isDarkMode
              ? 'invert(34%) sepia(7%) saturate(2567%) hue-rotate(334deg) brightness(93%) contrast(92%)'
              : 'invert(53%) sepia(32%) saturate(0%) hue-rotate(297deg) brightness(98%) contrast(97%)',
          }}
        />
      </div>
    </button>
  )
}
