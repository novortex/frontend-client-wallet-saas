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
      className="flex items-center p-1 rounded-md cursor-pointer focus:outline-none w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6"
      style={{ backgroundColor: isDarkMode ? '#171717' : '#F7FBFF' }}
    >
      {/* Lado Light */}
      <div
        className={`w-1/2 flex items-center justify-center transition-all duration-300 ease-in-out ${
          !isDarkMode ? 'bg-white rounded-md' : ''
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
        <h2 className={`ml-2 p-1 text-xs sm:text-sm ${!isDarkMode ? 'text-gray-900' : 'text-[#959CB6]'}`}>
          Light
        </h2>
      </div>

      {/* Lado Dark */}
      <div
        className={`w-1/2 flex items-center justify-center transition-all duration-300 ease-in-out ${
          isDarkMode ? 'bg-[#1C1C1C] rounded-md' : ''
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
        <h2 className={`ml-2 p-1 text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-[#959CB6]'}`}>
          Dark
        </h2>
      </div>
    </button>
  )
}
