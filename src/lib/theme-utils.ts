// Fixed theme utility functions and color constants
export const themeColors = {
  primary: {
    light: '#6D3C1F',
    dark: '#2C1505',
    hover: {
      light: '#5A3114',
      dark: '#83522A'
    },
    gradient: {
      from: '#46250A',
      to: '#2C1505'
    },
    opacity: {
      10: 'rgba(70, 37, 10, 0.1)',
      20: 'rgba(70, 37, 10, 0.2)',
      25: 'rgba(70, 37, 10, 0.25)',
      80: 'rgba(70, 37, 10, 0.8)'
    }
  },
  background: {
    light: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6'
    },
    dark: {
      primary: '#111827',
      secondary: '#1f2937',
      tertiary: '#374151'
    }
  },
  text: {
    light: {
      primary: '#111827',
      secondary: '#4b5563',
      tertiary: '#6b7280'
    },
    dark: {
      primary: '#f9fafb',
      secondary: '#d1d5db',
      tertiary: '#9ca3af'
    }
  },
  border: {
    light: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
      focus: '#fb6a44'
    },
    dark: {
      primary: '#374151',
      secondary: '#4b5563',
      focus: '#fb6a44'
    }
  }
};

// Generate theme-aware class names - Fixed version
export const getThemeClasses = (isDark: boolean = false) => {
  return {
    // Background classes - Fixed to prevent gray backgrounds
    bgPrimary: isDark ? 'bg-gray-900' : 'bg-white',
    bgSecondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
    bgTertiary: isDark ? 'bg-gray-700' : 'bg-gray-100',
    bgGradient: isDark 
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-white via-amber-50 to-[#46250A]/5',
    
    // Text classes - Simplified without redundant dark: prefixes
    textPrimary: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textTertiary: isDark ? 'text-gray-400' : 'text-gray-500',
  textAccent: isDark ? 'text-[#7DE1DA]' : 'text-[#50B7AF]',
    
    // Border classes - Simplified
    borderPrimary: isDark ? 'border-gray-700' : 'border-gray-200',
    borderSecondary: isDark ? 'border-gray-600' : 'border-gray-300',
    borderAccent: isDark ? 'border-[#5A3114]' : 'border-[#46250A]',
    
    // Button classes - Fixed hover states
    btnPrimary: isDark 
      ? 'bg-[#6D3C1F] hover:bg-[#83522A] text-white' 
      : 'bg-[#46250A] hover:bg-[#2C1505] text-white',
    btnSecondary: isDark
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    btnOutline: isDark
      ? 'border-2 border-[#83522A] text-[#83522A] hover:bg-[#83522A] hover:text-[#140A03]'
      : 'border-2 border-[#46250A] text-[#46250A] hover:bg-[#46250A] hover:text-white',
    
    // Card classes - Fixed backgrounds
    card: isDark
      ? 'bg-gray-800 border border-gray-700'
      : 'bg-white border border-gray-200',
    cardHover: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
    
    // Interactive elements
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    focus: isDark 
      ? 'focus:outline-none focus:ring-2 focus:ring-[#fb6a44] focus:ring-opacity-50'
      : 'focus:outline-none focus:ring-2 focus:ring-[#fb6a44] focus:ring-opacity-50',
    
    // Accent elements
    accent: isDark ? 'bg-[#83522A]' : 'bg-[#46250A]',
    accentLight: isDark ? 'bg-[#83522A]/20' : 'bg-[#46250A]/10',
    accentText: isDark ? 'text-[#83522A]' : 'text-[#46250A]'
  };
};

// Hook for getting current theme classes
export const useThemeClasses = (isDark?: boolean) => {
  return getThemeClasses(isDark);
};