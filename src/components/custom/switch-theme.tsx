import { useState } from 'react'
import moonIcon from '../../assets/icons/moon.svg'
import sunIcon from '../../assets/icons/Union.svg'

export function SwitchTheme() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="flex items-center w-1/6 p-1 rounded-md cursor-pointer" onClick={toggleTheme} style={{ backgroundColor: '#171717' }}>
      <div className={`w-1/2 flex justify-center transition-all duration-300 ease-in-out ${isDarkMode ? '' : 'bg-[#1C1C1C] rounded-md'}`}>
        <img
          src={sunIcon}
          alt=""
          style={{
            filter: isDarkMode
              ? 'invert(53%) sepia(32%) saturate(0%) hue-rotate(297deg) brightness(98%) contrast(97%)'
              : 'invert(34%) sepia(7%) saturate(2567%) hue-rotate(334deg) brightness(93%) contrast(92%)',
          }}
        />
        <h2 className={`text-center p-2 ${isDarkMode ? 'text-[#959CB6]' : 'text-white'}`}>Light</h2>
      </div>
      <div className={`w-1/2 flex justify-center transition-all duration-300 ease-in-out ${isDarkMode ? 'bg-[#1C1C1C] rounded-md' : ''}`}>
        <img
          src={moonIcon}
          alt=""
          style={{
            filter: isDarkMode
              ? 'invert(34%) sepia(7%) saturate(2567%) hue-rotate(334deg) brightness(93%) contrast(92%)'
              : 'invert(53%) sepia(32%) saturate(0%) hue-rotate(297deg) brightness(98%) contrast(97%)',
          }}
        />
        <h2 className={`text-center p-2 ${isDarkMode ? 'text-white' : 'text-[#959CB6]'}`}>Dark</h2>
      </div>
    </div>
  )
}
