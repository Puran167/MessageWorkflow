import React, { useEffect, useState } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldUseDark);
    updateTheme(shouldUseDark);
  }, []);

  const updateTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    updateTheme(newDarkMode);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className={`group relative inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
          isDark
            ? 'bg-yellow-500 text-yellow-50 hover:bg-yellow-400 shadow-lg shadow-yellow-500/25'
            : 'bg-indigo-600 text-indigo-50 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25'
        }`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="flex items-center space-x-2">
          {/* Icon container with smooth transition */}
          <div className="relative w-4 h-4 overflow-hidden">
            <div
              className={`absolute inset-0 transform transition-all duration-300 ${
                isDark ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}
            >
              {/* Sun icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div
              className={`absolute inset-0 transform transition-all duration-300 ${
                !isDark ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
              }`}
            >
              {/* Moon icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
          </div>

          {/* Text */}
          <span className="font-medium text-sm">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        </div>

        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20'
              : 'bg-gradient-to-r from-indigo-400/20 to-purple-600/20'
          }`}
        ></div>
      </button>
    </div>
  );
}
