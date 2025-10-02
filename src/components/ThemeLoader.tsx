'use client';

import { useTheme } from '@/contexts/UnifiedThemeContext';

const ThemeLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded } = useTheme();

  // Show a minimal loading screen while theme initializes
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e666c]"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ThemeLoader;
