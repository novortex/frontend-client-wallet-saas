import { useState, useEffect } from 'react';

export function Loading() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(storedTheme);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        theme === 'dark' ? 'bg-black/50' : 'bg-white'
      } backdrop-blur-md`}
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-transparent border-t-yellow-500 border-r-yellow-500 rounded-full animate-spin-clockwise"></div>
        <div
          className={`absolute inset-2 border-4 border-transparent ${
            theme === 'dark'
              ? 'border-b-white border-l-white'
              : 'border-b-black border-l-black'
          } rounded-full animate-spin-counterclockwise`}
        ></div>
      </div>
    </div>
  );
}
