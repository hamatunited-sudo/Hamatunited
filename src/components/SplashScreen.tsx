'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const { isDark } = useTheme();
  const { language, content } = useLanguage();
  const brand = content?.footer?.brand ?? {};
  const logoAlt = brand.name ?? content?.common?.[language]?.logo ?? content?.common?.ar?.logo ?? '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000); // Show splash for 2 seconds

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 2500); // Start fade out after 2.5 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        backgroundColor: isDark 
          ? 'rgba(0, 0, 0, 0.8)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Logo container */}
  <div className="relative z-10 flex flex-col items-center">
        {/* Logo with professional animation */}
        <div className="relative flex items-center justify-center">
          {/* Professional glow effect */}
          <div
            className="absolute -inset-7 rounded-full opacity-25 animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(251, 106, 68, 0.55) 0%, transparent 70%)',
              filter: 'blur(26px)',
            }}
          />

          {/* Circular loader */}
          <div className="absolute w-56 h-56 pointer-events-none">
            <svg viewBox="0 0 160 160" className="w-full h-full">
              <defs>
                <linearGradient id="splashRingBase" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? 'rgba(255,255,255,0.22)' : 'rgba(15,23,42,0.18)'} />
                  <stop offset="100%" stopColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)'} />
                </linearGradient>
                <linearGradient id="splashRingActive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd3c3" />
                  <stop offset="45%" stopColor="#fb6a44" />
                  <stop offset="100%" stopColor="#fd8b62" />
                </linearGradient>
                <radialGradient id="splashOrb" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff1ea" />
                  <stop offset="100%" stopColor="#fb6a44" />
                </radialGradient>
              </defs>

              <circle
                cx="80"
                cy="80"
                r="67"
                fill="none"
                stroke="url(#splashRingBase)"
                strokeWidth="2.5"
                strokeDasharray="5 10"
                opacity="0.45"
              />

              <g
                style={{
                  transformOrigin: 'center',
                  animation: 'spin 1.8s linear infinite',
                }}
              >
                <circle
                  cx="80"
                  cy="80"
                  r="67"
                  fill="none"
                  stroke="url(#splashRingActive)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="150 270"
                  transform="rotate(-90 80 80)"
                  opacity="0.92"
                />
              </g>

              <g
                style={{
                  transformOrigin: 'center',
                  animation: 'spin 1.8s linear infinite',
                  animationDelay: '-0.45s',
                }}
              >
                <circle cx="80" cy="13" r="5" fill="url(#splashOrb)" opacity="0.9" />
              </g>
            </svg>
          </div>

          <div className="relative animate-pulse">
            <Image
              src="/Logo_Splash.png"
              alt={logoAlt}
              width={160}
              height={160}
              className="w-auto h-auto max-w-[160px] max-h-[160px] object-contain filter drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
