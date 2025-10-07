// Fixed theme utility functions and color constants
export const themeColors = {
  primary: {
    light: '#1f5c48',
    dark: '#0d2d24',
    hover: {
      light: '#0f3c2f',
      dark: '#49a389'
    },
    gradient: {
      from: '#134333',
      to: '#0d2d24'
    },
    opacity: {
      10: 'rgba(19, 67, 51, 0.1)',
      20: 'rgba(19, 67, 51, 0.2)',
      25: 'rgba(19, 67, 51, 0.25)',
      80: 'rgba(19, 67, 51, 0.8)'
    }
  },
  background: {
    light: {
      primary: '#ffffff',
      secondary: '#f1f7f4',
      tertiary: '#e4efe9'
    },
    dark: {
      primary: '#0d211b',
      secondary: '#133329',
      tertiary: '#1a4134'
    }
  },
  text: {
    light: {
      primary: '#134333',
      secondary: '#3b6c5c',
      tertiary: '#5c8373'
    },
    dark: {
      primary: '#e3f2ed',
      secondary: '#c2d8cf',
      tertiary: '#9ab6ab'
    }
  },
  border: {
    light: {
      primary: '#d3e3dd',
      secondary: '#b9d1c9',
      focus: '#1f5c48'
    },
    dark: {
      primary: '#1e4034',
      secondary: '#2d5d4c',
      focus: '#49a389'
    }
  }
};

// Generate theme-aware class names - Fixed version
export const getThemeClasses = (isDark: boolean = false) => {
  return {
    // Background classes
    bgPrimary: isDark ? 'bg-[#0d211b]' : 'bg-white',
    bgSecondary: isDark ? 'bg-[#132f25]' : 'bg-[#f1f7f4]',
    bgTertiary: isDark ? 'bg-[#1a4134]' : 'bg-[#e4efe9]',
    bgGradient: isDark
      ? 'bg-gradient-to-br from-[#0d211b] via-[#133329] to-[#0d211b]'
      : 'bg-gradient-to-br from-white via-[#f1f7f4] to-[#134333]/5',

    // Text classes
    textPrimary: isDark ? 'text-[#e3f2ed]' : 'text-[#134333]',
    textSecondary: isDark ? 'text-[#c2d8cf]' : 'text-[#3b6c5c]',
    textTertiary: isDark ? 'text-[#9ab6ab]' : 'text-[#5c8373]',
    textAccent: isDark ? 'text-[#8dd7c0]' : 'text-[#134333]',

    // Border classes
    borderPrimary: isDark ? 'border-[#1e4034]' : 'border-[#d3e3dd]',
    borderSecondary: isDark ? 'border-[#2d5d4c]' : 'border-[#b9d1c9]',
    borderAccent: isDark ? 'border-[#49a389]' : 'border-[#134333]',

    // Button classes
    btnPrimary: isDark
      ? 'bg-[#1f5c48] hover:bg-[#49a389] text-white'
      : 'bg-[#134333] hover:bg-[#0f3327] text-white',
    btnSecondary: isDark
      ? 'bg-[#1a4134] hover:bg-[#1f4d3c] text-[#e3f2ed]'
      : 'bg-white hover:bg-[#f1f7f4] text-[#134333]',
    btnOutline: isDark
      ? 'border-2 border-[#49a389] text-[#49a389] hover:bg-[#49a389] hover:text-[#0d211b]'
      : 'border-2 border-[#134333] text-[#134333] hover:bg-[#134333] hover:text-white',

    // Card classes
    card: isDark
      ? 'bg-[#133329] border border-[#1e4034]'
      : 'bg-white border border-[#d3e3dd]',
    cardHover: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',

    // Interactive elements
    hover: isDark ? 'hover:bg-[#1a4134]' : 'hover:bg-[#f1f7f4]',
    focus: isDark
      ? 'focus:outline-none focus:ring-2 focus:ring-[#49a389] focus:ring-opacity-45'
      : 'focus:outline-none focus:ring-2 focus:ring-[#1f5c48] focus:ring-opacity-40',

    // Accent elements
    accent: isDark ? 'bg-[#49a389]' : 'bg-[#134333]',
    accentLight: isDark ? 'bg-[#49a389]/20' : 'bg-[#134333]/10',
    accentText: isDark ? 'text-[#49a389]' : 'text-[#134333]'
  };
};

// Hook for getting current theme classes
export const useThemeClasses = (isDark?: boolean) => {
  return getThemeClasses(isDark);
};