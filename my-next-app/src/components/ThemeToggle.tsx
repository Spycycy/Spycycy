"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-1">
      <button
        aria-label="Light Mode"
        className={`p-2 rounded hover:bg-blue-800 transition ${theme === 'light' ? 'bg-blue-800 text-yellow-300' : 'text-white'}`}
        onClick={() => setTheme('light')}
      >
        {/* Sun Icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.05 6.05L4.64 4.64m12.02 0l-1.41 1.41M6.05 17.95l-1.41 1.41" />
        </svg>
      </button>
      <button
        aria-label="Dark Mode"
        className={`p-2 rounded hover:bg-blue-800 transition ${theme === 'dark' ? 'bg-blue-800 text-yellow-300' : 'text-white'}`}
        onClick={() => setTheme('dark')}
      >
        {/* Moon Icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      </button>
      <button
        aria-label="System Mode"
        className={`p-2 rounded hover:bg-blue-800 transition ${theme === 'system' ? 'bg-blue-800 text-yellow-300' : 'text-white'}`}
        onClick={() => setTheme('system')}
      >
        {/* Computer Icon */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="4" width="20" height="14" rx="2" />
          <path d="M8 20h8" />
        </svg>
      </button>
    </div>
  );
}