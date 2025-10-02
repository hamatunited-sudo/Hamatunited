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
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Force light theme always
      const shouldBeDark = false; // Always use light theme
      
      setIsDark(shouldBeDark);
      
      // Apply theme to document
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Theme initialization failed:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleTheme = () => {
    if (!isLoaded || typeof window === 'undefined') return;
    
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    try {
      if (newIsDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.warn('Theme toggle failed:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, isLoaded, toggleTheme }}>
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
