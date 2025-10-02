/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { getThemeClasses } from '@/lib/theme-utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LucideIcon } from 'lucide-react';
import { Award, Clock3, MessagesSquare, Users2 } from 'lucide-react';

// Custom hook for counting animation
const useCount = (target: number, start: boolean, duration: number, delay: number = 0) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setCount(Math.round(target * easeProgress));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, start, duration, delay]);

  return count;
};

const Stats = () => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const [statsVisible, setStatsVisible] = useState(false);

  const { language, content } = useLanguage();
  const contentAny = content as any;
  const defaultStatsContent = contentAny?.stats?.ar;
  const statsContent = contentAny?.stats?.[language] ?? defaultStatsContent ?? {};
  const statsLabels = statsContent.labels ?? defaultStatsContent?.labels ?? {};

  const statsUI = contentAny.ui?.stats?.[language] ?? contentAny.ui?.stats?.ar ?? {};

  const sectionCopy = {
    eyebrow: statsUI.eyebrow ?? '',
    title: statsUI.title ?? '',
    description: statsUI.description ?? ''
  };

  // Observe when the stats section enters the viewport
  useEffect(() => {
    const el = document.getElementById('stats-section');
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const countSessions = useCount(statsContent.sessions ?? 0, statsVisible, 1400, 0);
  const countConsultations = useCount(statsContent.consultations ?? 0, statsVisible, 1400, 80);
  const countBeneficiaries = useCount(statsContent.beneficiaries ?? 0, statsVisible, 1400, 160);
  const countYears = useCount(statsContent.years ?? 0, statsVisible, 1400, 240);

  const baseRing = isDark ? 'ring-gray-700/40' : 'ring-gray-200/60';
  const accentRing = isDark ? 'ring-[#7DE1DA]/35' : 'ring-[#50B7AF]/25';

  type StatItem = {
    key: string;
    Icon: LucideIcon;
    value: number;
    label: string;
    accentBackground: string;
    accentText: string;
    ring: string;
    bar: string;
  };

  const statsData: StatItem[] = [
    {
      key: 'sessions',
      Icon: Clock3,
      value: countSessions,
  label: statsLabels.sessions ?? '',
      accentBackground: theme.accent,
      accentText: theme.accentText,
      ring: `ring-1 ${accentRing}`,
  bar: isDark ? 'bg-[#7DE1DA]' : 'bg-[#50B7AF]'
    },
    {
      key: 'consultations',
      Icon: MessagesSquare,
      value: countConsultations,
  label: statsLabels.consultations ?? '',
      accentBackground: 'bg-[#fb6a44]',
      accentText: 'text-[#fb6a44]',
      ring: 'ring-1 ring-[#fb6a44]/35',
      bar: 'bg-[#fb6a44]'
    },
    {
      key: 'beneficiaries',
      Icon: Users2,
      value: countBeneficiaries,
  label: statsLabels.beneficiaries ?? '',
      accentBackground: theme.accent,
      accentText: theme.accentText,
      ring: `ring-1 ${accentRing}`,
  bar: isDark ? 'bg-[#7DE1DA]' : 'bg-[#50B7AF]'
    }
  ];

  if ((statsContent.years ?? 0) > 0) {
    statsData.push({
      key: 'years',
      Icon: Award,
      value: countYears,
  label: statsLabels.years ?? '',
      accentBackground: 'bg-[#fb6a44]',
      accentText: 'text-[#fb6a44]',
      ring: `ring-1 ${baseRing}`,
      bar: 'bg-[#fb6a44]'
    });
  }

  return (
    <section id="stats-section" className={`relative py-14 sm:py-16 md:py-20 ${theme.bgSecondary}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`relative mx-auto max-w-6xl overflow-hidden rounded-3xl border ${
            isDark ? 'border-gray-700 bg-gray-900/70' : 'border-gray-100 bg-white'
          } px-6 py-12 sm:px-10 sm:py-14 shadow-xl transition-shadow duration-300`}
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#fb6a44]" />
          <span
            className={`pointer-events-none absolute -left-16 bottom-10 h-36 w-36 rounded-full bg-[#fb6a44]/10`}
          />
          <span
            className={`pointer-events-none absolute -right-20 top-12 h-40 w-40 rounded-full ${
              isDark ? 'bg-[#7DE1DA]/10' : 'bg-[#50B7AF]/10'
            }`}
          />

          <div className="relative text-center">
            <span className="inline-flex items-center justify-center rounded-full bg-[#fb6a44]/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[#fb6a44]">
              {sectionCopy.eyebrow}
            </span>
            <h2 className={`mt-4 text-2xl sm:text-3xl md:text-4xl font-bold ${theme.textPrimary}`}>
              {sectionCopy.title}
            </h2>
            <p className={`mx-auto mt-3 max-w-2xl text-sm sm:text-base ${theme.textSecondary}`}>
              {sectionCopy.description}
            </p>
          </div>

          <div className="relative mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4">
            {statsData.map((item) => (
              <div
                key={item.key}
                className={`${
                  theme.card
                } group relative overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  item.ring
                }`}
              >
                <span className={`absolute inset-x-0 top-0 h-1 ${item.bar}`} />
                <div className="relative flex flex-col items-center gap-4 text-center">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${item.accentBackground}`}>
                    <item.Icon className="h-9 w-9 text-white" strokeWidth={1.6} />
                  </div>
                  <div className={`text-4xl font-extrabold tracking-tight ${item.accentText}`}>
                    +{item.value}
                  </div>
                  <div className={`text-sm font-semibold sm:text-base ${theme.textSecondary}`}>
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
