'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type NavItem = {
  id: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'الرئيسية' },
  { id: 'about', label: 'من نحن' },
  { id: 'services', label: 'خدماتنا' },
  { id: 'advantages', label: 'لماذا هامات يوناتيد؟' },
  { id: 'process', label: 'خطوات العمل' },
  { id: 'blog', label: 'المدونة' },
];

const scrollToSection = (sectionId: string) => {
  const cleanId = sectionId.replace('#', '');
  const element = document.getElementById(cleanId);
  if (!element) return;

  // Compact header height
  const headerHeight = 52;
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offset = elementPosition - headerHeight;

  window.scrollTo({ top: offset >= 0 ? offset : 0, behavior: 'smooth' });
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Track which section is currently in view to mark the nav item as active
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id || null);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, { root: null, threshold: 0.45 });
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    observers.push(observer);
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-white/95 shadow-[0_12px_40px_rgba(19,67,51,0.12)] backdrop-blur-xl border-b border-[#d3e3dd]'
          : 'bg-gradient-to-b from-white/95 via-[#f1f7f4]/90 to-white/70 backdrop-blur-xl'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="flex items-center justify-between gap-6 py-1.5 lg:py-2">
          <button
            onClick={() => {
              scrollToSection('home');
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-3 text-right"
            aria-label="العودة إلى بداية الصفحة"
          >
            {/* Logo image (no background square, larger) */}
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 transition-all duration-300">
              <Image src="/HAMAT logo.svg" alt="شعار شركة هامات يوناتيد" fill sizes="(max-width: 640px) 80px, 96px" style={{ objectFit: 'contain' }} />
            </div>
            <span className="flex flex-col text-right">
              <span className="text-base sm:text-lg font-semibold tracking-wide text-[#134333] whitespace-nowrap">
                شركة هامات يوناتيد
              </span>
              <span className="text-sm sm:text-base text-[#3b6c5c] whitespace-nowrap hidden sm:block">
                هندسة متخصصة في حقن التربة وضبط الجودة بعقود موثوقة
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-1 xl:gap-2 text-sm font-semibold text-[#134333] flex-nowrap">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id} className="shrink-0">
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`rounded-xl px-3 xl:px-5 py-2.5 transition-all duration-300 active:scale-95 whitespace-nowrap ${
                        isActive
                          ? 'bg-[#134333] text-white shadow-[0_8px_20px_rgba(19,67,51,0.15)]'
                          : 'text-[#134333] hover:bg-[#134333]/10 hover:text-[#0f3327]'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
            {/* phone and CTA removed per design request */}
          </div>

          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#d3e3dd] bg-white text-[#134333] backdrop-blur-sm transition-all duration-300 hover:bg-[#f1f7f4] hover:border-[#b9d1c9] active:scale-90 lg:hidden"
            aria-label="فتح القائمة الرئيسية"
          >
            <span className="sr-only">القائمة الرئيسية</span>
            <span
              className={`block h-0.5 w-6 transform rounded-full bg-current transition-all duration-300 ${
                isMobileOpen ? 'translate-y-2 rotate-45' : 'translate-y-0'
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-opacity duration-300 ${
                isMobileOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`block h-0.5 w-6 transform rounded-full bg-current transition-all duration-300 ${
                isMobileOpen ? '-translate-y-2 -rotate-45' : 'translate-y-0'
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-x-0 top-[48px] z-40 origin-top border-t border-[#d3e3dd] bg-white shadow-[0_20px_50px_rgba(19,67,51,0.08)] backdrop-blur-xl transition-all duration-500 ease-out lg:hidden ${
          isMobileOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-0 opacity-0'
        }`}
      >
        <div className="space-y-3 px-4 pb-8 pt-6">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsMobileOpen(false);
                }}
                className={`block w-full rounded-2xl px-5 py-4 text-right text-base font-semibold backdrop-blur-sm transition-all duration-300 active:scale-98 ${
                  isActive
                    ? 'bg-[#134333] text-white shadow-[0_10px_24px_rgba(19,67,51,0.12)]'
                    : 'text-[#134333] bg-[#f1f7f4] hover:bg-[#134333]/10 hover:text-[#0f3327]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {/* phone and CTA removed from mobile menu */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
