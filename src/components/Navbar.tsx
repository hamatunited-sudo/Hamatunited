'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { getThemeClasses } from '@/lib/theme-utils';
import type { ContentData } from '@/hooks/useContent';

type NavItem = ContentData['navbar']['items'][number];

const Navbar = () => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { language, toggleLanguage, content } = useLanguage();
  const lastScrollYRef = useRef(0);
  const navShellRef = useRef<HTMLDivElement | null>(null);
  const defaultHeaderContent = content.header?.ar;
  const headerContent = content.header?.[language] ?? defaultHeaderContent;
  const defaultHeroContent = content.hero?.ar;
  const heroContent = content.hero?.[language] ?? defaultHeroContent;
  const defaultCommonContent = content.common?.ar;
  const commonContent = content.common?.[language] ?? defaultCommonContent;

  const baseNavItems = useMemo<NavItem[]>(
    () => content.navbar?.items ?? [],
    [content]
  );

  const headerNavLabels = headerContent?.nav ?? [];

  const navItems = baseNavItems.map((item, idx) => ({
    ...item,
    label: headerNavLabels[idx] ?? item.label,
  }));

  const brandName = commonContent?.logo ?? '';

  const ctaLabel = heroContent?.ctaPrimary ?? defaultHeroContent?.ctaPrimary ?? '';
  const ctaLink = heroContent?.ctaPrimaryLink ?? defaultHeroContent?.ctaPrimaryLink ?? '';

  const descriptor = headerContent?.descriptor ?? defaultHeaderContent?.descriptor ?? '';

  const toggleLabel = language === 'en'
    ? content.common?.ar?.language ?? ''
    : content.common?.en?.language ?? '';

  const homeNavLabel = navItems[0]?.label ?? headerNavLabels[0] ?? '';

  const ACCENT_PRIMARY = '#fb6a44';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    lastScrollYRef.current = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const hasScrolled = currentScrollY > 32;
        setIsScrolled(hasScrolled);

        const scrollDiff = currentScrollY - lastScrollYRef.current;

        if (currentScrollY < 120) {
          setIsVisible(true);
        } else if (scrollDiff > 12) {
          setIsVisible(false);
          setIsMobileMenuOpen(false);
        } else if (scrollDiff < -12) {
          setIsVisible(true);
        }

        lastScrollYRef.current = currentScrollY;
        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    const trimmedId = sectionId.replace('#', '');
    const target = document.getElementById(trimmedId);

    if (target) {
      const navHeight = navShellRef.current?.offsetHeight ?? 96;
      const offset =
        window.pageYOffset + target.getBoundingClientRect().top - navHeight - 16;
      window.scrollTo({
        top: offset >= 0 ? offset : 0,
        behavior: 'smooth',
      });
    } else {
      window.location.hash = trimmedId;
    }

    setIsMobileMenuOpen(false);
  };

  const handleCtaClick = () => {
    if (!ctaLink) {
      return;
    }

    if (ctaLink.startsWith('#')) {
      scrollToSection(ctaLink);
      return;
    }

    if (ctaLink.startsWith('http')) {
      window.open(ctaLink, '_blank', 'noopener');
      setIsMobileMenuOpen(false);
      return;
    }

    window.location.assign(ctaLink);
    setIsMobileMenuOpen(false);
  };

  const navBackgroundClass = isDark ? 'bg-[#0b1c2a]/85' : 'bg-white/90';
  const navShadowClass = isDark
    ? 'shadow-[0_28px_55px_rgba(5,9,20,0.55)]'
    : 'shadow-[0_28px_55px_rgba(17,48,74,0.12)]';
  const mutedTextClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const navHoverTextClass = isDark ? 'hover:text-gray-100' : 'hover:text-gray-900';

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        } ${isScrolled ? 'pt-3' : 'pt-6'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={navShellRef}
            className={`relative flex items-center justify-between gap-4 rounded-[28px] border ${theme.borderPrimary} ${navBackgroundClass} ${navShadowClass} backdrop-blur-2xl px-4 sm:px-6 py-3 lg:py-4 transition-all duration-500`}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-[28px]"
              style={{
                background: isDark
                  ? 'linear-gradient(120deg, rgba(42,136,145,0.18) 0%, rgba(7,17,31,0.4) 100%)'
                  : 'linear-gradient(120deg, rgba(30,102,108,0.18) 0%, rgba(255,255,255,0.7) 100%)',
              }}
            />
            <span className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/10 dark:border-white/5" />
            <span
              className="pointer-events-none absolute left-6 right-6 -top-[6px] h-[3px] rounded-full opacity-80"
              style={{
                backgroundColor: '#fb6a44',
              }}
            />

            <button
              onClick={() => scrollToSection('home')}
              className={`relative flex min-w-0 flex-1 items-center gap-3 sm:gap-4 group ${
              language === 'ar'
                ? 'flex-row justify-end text-right'
                : 'flex-row justify-start text-left'
            }`}
              aria-label={homeNavLabel || undefined}
            >
              <span
                className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-white/90 shadow-inner transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:scale-[1.02] dark:border-white/10 dark:bg-slate-900/80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={isDark ? '/Logo_white.png' : '/Logo.png'}
                  alt={brandName}
                  className="h-8 w-auto object-contain"
                />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span
                  className={`truncate text-xs font-semibold uppercase tracking-[0.18em] ${theme.textPrimary}`}
                >
                  {brandName}
                </span>
                <span className={`truncate text-[11px] ${mutedTextClass}`}>
                  {descriptor}
                </span>
              </span>
            </button>

            <ul className="hidden flex-1 items-center justify-center gap-1 xl:flex">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full px-4 py-2 text-sm font-medium ${theme.textSecondary} ${navHoverTextClass} transition-all duration-300`}
                  >
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        backgroundColor: isDark
                          ? 'rgba(251,106,68,0.32)'
                          : 'rgba(251,106,68,0.18)',
                      }}
                    />
                    <span className="pointer-events-none absolute bottom-0.5 h-1 w-0 rounded-full bg-[#fb6a44] transition-all duration-300 ease-out group-hover:w-3/4" />
                    <span className="relative whitespace-nowrap">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-3 lg:flex">
              <button
                onClick={toggleLanguage}
                className={`inline-flex items-center gap-2 rounded-full border ${theme.borderPrimary} px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isDark ? 'bg-white/5 text-gray-100 hover:bg-white/10' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label={toggleLabel || undefined}
              >
                <svg
                  className={`h-4 w-4 ${theme.textSecondary}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12h20M12 2c3 3 3 7 3 10s0 7-3 10M12 2c-3 3-3 7-3 10s0 7 3 10"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm">
                  {toggleLabel}
                </span>
              </button>

              <button
                onClick={handleCtaClick}
                className="relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full px-5 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-[2px] hover:shadow-lg"
              >
                <span
                  className="absolute inset-0"
                  style={{
                    background: ACCENT_PRIMARY,
                  }}
                />
                <span className="relative">{ctaLabel}</span>
                <svg
                  className="relative h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 10h10m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={`relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border ${theme.borderPrimary} ${
                  isDark ? 'bg-white/10' : 'bg-white/90'
                } transition-all duration-300 hover:-translate-y-[1px] hover:shadow-md`}
              >
                <span
                  className={`absolute mx-auto h-0.5 w-6 rounded-full transition-transform duration-500 ease-out ${
                    isMobileMenuOpen
                      ? 'translate-y-0 rotate-45 bg-[#fb6a44]'
                      : '-translate-y-2 bg-[#fb6a44]'
                  }`}
                />
                <span
                  className={`absolute mx-auto h-0.5 w-6 rounded-full transition-transform duration-500 ease-out ${
                    isMobileMenuOpen
                      ? 'translate-y-0 -rotate-45 bg-[#fb6a44]'
                      : 'translate-y-2 bg-[#fb6a44]'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[90] transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute inset-x-0 top-[96px] px-4 transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div
            className={`overflow-hidden rounded-3xl border ${theme.borderPrimary} ${navBackgroundClass} ${navShadowClass} backdrop-blur-2xl`}
          >
            <div className="space-y-2 p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full rounded-2xl border border-transparent px-4 py-3 text-left text-base font-semibold transition-all duration-300 ${
                    isDark
                      ? 'bg-white/5 text-gray-100 hover:bg-white/10'
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="space-y-4 border-t border-white/10 p-4">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl border ${theme.borderPrimary} px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  isDark
                    ? 'bg-white/5 text-gray-100 hover:bg-white/10'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12h20M12 2c3 3 3 7 3 10s0 7-3 10M12 2c-3 3-3 7-3 10s0 7 3 10"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{toggleLabel}</span>
              </button>
              <button
                onClick={handleCtaClick}
                className="relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold text-white"
              >
                <span
                  className="absolute inset-0"
                  style={{
                    background: ACCENT_PRIMARY,
                  }}
                />
                <span className="relative">{ctaLabel}</span>
                <svg
                  className="relative h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 10h10m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
