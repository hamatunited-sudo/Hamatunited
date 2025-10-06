'use client';

import { useTheme } from '@/contexts/UnifiedThemeContext';

const SectionSeparator = () => {
  const { isDark } = useTheme();

  const lineGradient = isDark
    ? 'from-transparent via-white/40 to-transparent'
    : 'from-transparent via-[#F6D3B4] to-transparent';

  const accentBase = isDark ? 'bg-white/70 shadow-white/40' : 'bg-[#F6A668] shadow-[#F7C79D]/60';
  const accentGlow = isDark ? 'bg-white/10' : 'bg-[#F1C59B]/40';

  return (
    <div className="relative flex w-full items-center justify-center py-12">
      <div
        className={`h-px w-full max-w-6xl bg-gradient-to-r ${lineGradient}`}
        aria-hidden="true"
      />
      <span
        className={`absolute h-12 w-12 rounded-full ${accentGlow} blur-3xl`}
        aria-hidden="true"
      />
      <span
        className={`absolute h-3 w-3 rounded-full ${accentBase} shadow-[0_0_18px_var(--tw-shadow-color)] transition-transform duration-700 ease-out hover:scale-110`}
        aria-hidden="true"
      />
    </div>
  );
};

export default SectionSeparator;
