'use client';

import { useTheme } from '@/contexts/UnifiedThemeContext';

const SectionSeparator = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <div 
        className={`w-full h-px ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}
        style={{ opacity: 0.3 }}
      ></div>
    </div>
  );
};

export default SectionSeparator;
