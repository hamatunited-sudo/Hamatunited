'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  isDark: boolean;
  isLoaded: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Force light theme only - isDark is always false
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Force light theme
      setIsLoaded(false);
      
      // Always set light theme
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
      
      // Remove any dark theme from localStorage
      localStorage.setItem('theme', 'light');
      
    } catch (error) {
      console.warn('Theme initialization failed:', error);
      // Even on error, force light theme
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Disabled toggle function - does nothing
  const toggleTheme = () => {
    // Theme toggle is disabled - always light theme
    console.log('Theme toggle is disabled - website is in light mode only');
  };

  return (
    <ThemeContext.Provider value={{ isDark: false, isLoaded, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
