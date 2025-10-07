/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTheme } from '@/contexts/UnifiedThemeContext';
import { getThemeClasses } from '@/lib/theme-utils';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface Testimonial {
  text: string;
  name: string;
  title?: string;
  iconColor?: string;
  gender?: 'male' | 'female';
}

type SwipeTracker = {
  startX: number;
  isActive: boolean;
  handled: boolean;
  pointerId: number;
};

const QuoteIcon = (
  {
    className = '',
    color = '#2a8891'
  }: {
    className?: string;
    color?: string;
  }
) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M27.2 10H10v18.4h12.8A6.4 6.4 0 0 1 29.2 34.8v18.4H10V54h17.2a9.2 9.2 0 0 0 9.2-9.2V29.2A19.2 19.2 0 0 0 27.2 10Zm26.8 0H36v18.4h12.8A6.4 6.4 0 0 1 56 34.8v18.4H36V54h17.2a9.2 9.2 0 0 0 9.2-9.2V29.2A19.2 19.2 0 0 0 54 10Z"
      fill={color}
      fillOpacity={0.85}
    />
  </svg>
);

const Testimonials = () => {
  const { isDark } = useTheme();
  const theme = getThemeClasses(isDark);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const swipeState = useRef<SwipeTracker>({ startX: 0, isActive: false, handled: false, pointerId: -1 });
  const { language, content } = useLanguage();
  const contentAny = content as any;
  const testimonials: Testimonial[] = contentAny.testimonials?.[language] ?? contentAny.testimonials?.ar ?? [];
  const uiStrings = contentAny.ui?.testimonials?.[language] ?? contentAny.ui?.testimonials?.ar ?? {};
  const title = uiStrings?.title ?? '';
  const subtitle = uiStrings?.subtitle ?? '';

  // Function to get avatar based on gender
  const getAvatarIcon = (gender?: 'male' | 'female', name?: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
      sm: 'w-6 h-6 sm:w-7 sm:h-7',
      md: 'w-7 h-7 sm:w-8 sm:h-8',
      lg: 'w-9 h-9 sm:w-10 sm:h-10'
    };
    const sizePixels: Record<'sm' | 'md' | 'lg', number> = {
      sm: 28,
      md: 32,
      lg: 40
    };

    if (gender === 'female') {
      return (
        <Image
          src="/icons/Female.svg"
          alt={name ?? ''}
          width={sizePixels[size]}
          height={sizePixels[size]}
          className={sizeClasses[size]}
        />
      );
    }

    if (gender === 'male') {
      return (
        <Image
          src="/icons/Male.svg"
          alt={name ?? ''}
          width={sizePixels[size]}
          height={sizePixels[size]}
          className={sizeClasses[size]}
        />
      );
    }

    // Default generic person icon
    return (
      <svg className={`${sizeClasses[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
      </svg>
    );
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      if (typeof window === 'undefined') {
        return;
      }

      const width = window.innerWidth;
      const maxCards = width >= 1280 ? 3 : width >= 768 ? 2 : 1;
      const availableCards = testimonials.length || 1;

      setVisibleCount(Math.min(maxCards, availableCards));
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);

    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [testimonials.length]);

  useEffect(() => {
    if (!testimonials.length) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex((prev) => prev % testimonials.length);
  }, [testimonials.length]);

  // Reset drag offset when the active card changes
  useEffect(() => {
    if (!swipeState.current.isActive) {
      setDragOffset(0);
    }
  }, [currentIndex]);

  const goToPrevious = useCallback(() => {
    if (!testimonials.length) {
      return;
    }

    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  }, [testimonials.length]);

  const goToNext = useCallback(() => {
    if (!testimonials.length) {
      return;
    }

    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const setIndexWithDirection = (targetIndex: number) => {
    if (targetIndex === currentIndex || !testimonials.length) {
      return;
    }

    setCurrentIndex(targetIndex);
  };

  const swipeThreshold = 50;

  const resetSwipe = (target?: EventTarget & HTMLDivElement) => {
    if (swipeState.current.pointerId !== -1 && target) {
      try {
        target.releasePointerCapture(swipeState.current.pointerId);
      } catch {
        // ignore release errors
      }
    }
    swipeState.current = { startX: 0, isActive: false, handled: false, pointerId: -1 };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    setIsDragging(true);
    setDragOffset(0);
    swipeState.current = {
      startX: event.clientX,
      isActive: true,
      handled: false,
      pointerId: event.pointerId,
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // ignore capture errors
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!swipeState.current.isActive) {
      return;
    }

    const deltaX = event.clientX - swipeState.current.startX;

    if (testimonials.length > 1 && Math.abs(deltaX) >= swipeThreshold) {
      const isPrev = deltaX > 0;
      const overshoot = deltaX - (isPrev ? swipeThreshold : -swipeThreshold);

      if (isPrev) {
        goToPrevious();
      } else {
        goToNext();
      }

      swipeState.current.startX = event.clientX - overshoot;
      setDragOffset(overshoot);
    } else {
      setDragOffset(deltaX);
    }

    event.preventDefault();
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!swipeState.current.isActive) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    const deltaX = dragOffset;
    if (testimonials.length > 1 && Math.abs(deltaX) >= swipeThreshold) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    setIsDragging(false);
    setDragOffset(0);
    swipeState.current.handled = true;
    resetSwipe(event.currentTarget);
  };

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      if (!swipeState.current.isActive && !isDragging) {
        goToNext();
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [testimonials.length, isDragging, goToNext]);

  const visibleIndices = useMemo(() => {
    if (!testimonials.length) {
      return [] as number[];
    }

    const limitedCount = Math.min(visibleCount, testimonials.length);

    if (limitedCount <= 1) {
      return [currentIndex];
    }

    if (limitedCount === 2) {
      const previousIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      return [previousIndex, currentIndex];
    }

    const previousIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    const nextIndex = (currentIndex + 1) % testimonials.length;
    const indices = [previousIndex, currentIndex, nextIndex];

    if (limitedCount > 3) {
      for (let offset = 2; indices.length < limitedCount; offset += 1) {
        indices.push((currentIndex + offset) % testimonials.length);
      }
    }

    return indices.slice(0, limitedCount);
  }, [currentIndex, testimonials.length, visibleCount]);

  const isRtl = language === 'ar';
  const gridColsClass =
    visibleIndices.length === 1
      ? 'grid-cols-1'
      : visibleIndices.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  const accentBaseColor = '#134333';
  const accentSecondary = '#1f5c48';
  const accentGlowPrimary = isDark ? 'rgba(120, 204, 182, 0.28)' : 'rgba(19, 67, 51, 0.18)';
  const accentGlowSecondary = isDark ? 'rgba(73, 163, 137, 0.24)' : 'rgba(31, 92, 72, 0.18)';
  const focusRingClass = isDark
    ? 'focus-visible:ring-[#49a389] focus-visible:ring-offset-gray-900'
    : 'focus-visible:ring-[#134333] focus-visible:ring-offset-white';

  if (!testimonials.length) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className={`relative overflow-hidden py-12 sm:py-16 md:py-20 ${theme.bgPrimary}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-20 top-24 h-72 w-72 rounded-full"
          style={{ backgroundColor: accentGlowPrimary, filter: 'blur(140px)' }}
        />
        <div
          className="absolute right-[-15%] bottom-10 h-80 w-80 rounded-full"
          style={{ backgroundColor: accentGlowSecondary, filter: 'blur(160px)' }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold transition-colors duration-500 ${theme.textPrimary}`}>
            {title}
          </h2>
          {subtitle ? (
            <p className={`mt-4 text-base sm:text-lg md:text-xl leading-relaxed ${theme.textSecondary}`}>
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="relative mt-12 sm:mt-16">
          <div
            className={`grid ${gridColsClass} gap-6 sm:gap-8 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
              touchAction: 'pan-y',
              userSelect: 'none',
              transform: `translateX(${dragOffset}px)`,
            } as CSSProperties}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            {visibleIndices.map((testIndex) => {
              const testimonial = testimonials[testIndex];
              const accentColor = testimonial.iconColor ?? accentBaseColor;
              const isPrimary = testIndex === currentIndex;
              const avatarSize = isPrimary ? 'lg' : 'md';
              const textDirectionClass = isRtl ? 'text-right' : 'text-left';
              const flexDirectionClass = isRtl ? 'flex-row-reverse' : 'flex-row';
              const accentGlow = isPrimary ? `${accentSecondary}35` : `${accentColor}28`;
              const cardBorderColor = isPrimary ? accentSecondary : (isDark ? '#214938' : '#1f5c48');
              const cardAccent = isPrimary ? accentSecondary : accentColor;
              const cardBackground = isDark ? '#133329' : '#134333';
              const cardPrimaryText = isDark ? 'text-[#e3f2ed]' : 'text-white';
              const cardSecondaryText = isDark ? 'text-[#c2d8cf]' : 'text-[#d9ece5]';
              const cardMutedText = isDark ? 'text-[#9ab6ab]' : 'text-[#bcded2]';

              return (
                <article
                  key={`${testimonial.name}-${testIndex}`}
                  className={`group/card relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border p-6 sm:p-8 ${theme.cardHover}`}
                  style={{
                    borderColor: cardBorderColor,
                    backgroundColor: cardBackground,
                    boxShadow: isPrimary
                      ? (isDark ? '0 24px 40px rgba(15, 30, 25, 0.45)' : '0 24px 46px rgba(19, 67, 51, 0.22)')
                      : (isDark ? '0 16px 32px rgba(15, 30, 25, 0.28)' : '0 14px 30px rgba(73, 163, 137, 0.16)')
                  }}
                >
                  <span
                    className="pointer-events-none absolute left-6 right-6 top-0 h-1 rounded-full"
                    style={{ backgroundColor: cardAccent, opacity: 0.7 }}
                  />
                  <span
                    className={`pointer-events-none absolute ${isRtl ? 'left-6' : 'right-6'} top-6 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/12 shadow-inner`}
                    style={{
                      color: cardAccent,
                      border: `1px solid ${cardAccent}30`,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <QuoteIcon className="h-4 w-4" color={cardAccent} />
                  </span>
                  <div className="relative z-10 flex flex-col">
                    <p
                      className={`mt-4 text-base sm:text-lg leading-relaxed ${textDirectionClass} ${cardSecondaryText}`}
                    >
                    {`“${testimonial.text}”`}
                    </p>
                    <div className={`mt-8 flex items-center gap-4 ${flexDirectionClass}`}>
                      <div className="relative">
                        <span
                          className="pointer-events-none absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: accentGlow,
                            filter: 'blur(26px)'
                          }}
                        />
                        <span
                          className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-md shadow-black/10"
                          style={{
                            backgroundColor: cardAccent,
                            boxShadow: `0 18px 40px -18px ${cardAccent}aa`
                          }}
                        >
                          {getAvatarIcon(testimonial.gender, testimonial.name, avatarSize)}
                        </span>
                      </div>
                      <div className={`${textDirectionClass}`}>
                        <p className={`font-semibold text-lg sm:text-xl ${cardPrimaryText}`}>
                          {testimonial.name}
                        </p>
                        {testimonial.title ? (
                          <p className={`mt-1 text-sm sm:text-base ${cardMutedText}`}>
                            {testimonial.title}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {testimonials.map((testimonial, index) => (
              <button
                key={`${testimonial.name}-${index}`}
                type="button"
                onClick={() => setIndexWithDirection(index)}
                aria-label={`${title} ${index + 1}`.trim() || undefined}
                aria-current={index === currentIndex}
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${focusRingClass} ${
                  index === currentIndex
                    ? 'w-6 bg-[#134333]'
                    : 'w-2.5 bg-[#134333]/20 hover:bg-[#134333]/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;
