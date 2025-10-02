'use client';

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(false); // Default to light to prevent hydration mismatch
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Get the saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    setIsLoaded(true);
    
    // Apply the theme immediately
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (!isLoaded || typeof window === 'undefined') return; // Don't toggle if not loaded or on server
    
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return {
    isDark,
    isLoaded,
    toggleTheme
  };
};
