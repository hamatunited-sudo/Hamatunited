'use client';

import Image from 'next/image';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {
  const { isDark } = useTheme();
  const { language, content } = useLanguage();
  const isRTL = language === 'ar';
  const defaultHeroContent = content.hero?.ar;
  const heroContent = content.hero?.[language] ?? defaultHeroContent;
  const heroPrimaryLink = heroContent?.ctaPrimaryLink ?? defaultHeroContent?.ctaPrimaryLink;
  const heroSecondaryLink = heroContent?.ctaSecondaryLink ?? defaultHeroContent?.ctaSecondaryLink;

  const ACCENT_PRIMARY = '#50b7af';
  const BUTTON_COLOR = '#fb6a44';
  const BUTTON_COLOR_DARKER = '#e55a3a';
  const BUTTON_COLOR_LIGHT = 'rgba(251, 106, 68, 0.12)';
  const BUTTON_COLOR_FRAME = 'rgba(251, 106, 68, 0.35)';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Account for navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLink = (link?: string) => {
    if (!link) return;
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('//')) {
      window.open(link, '_blank');
      return;
    }
    if (link.startsWith('/')) {
      window.location.href = link;
      return;
    }
    const id = link.replace(/^#|^\/+/, '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home" 
      className="hero relative min-h-screen pt-20 pb-16 sm:pt-24 section-offset"
      style={{
        background: isDark 
          ? 'linear-gradient(to top, #0f172a 0%, #1e293b 50%, #1f2937 100%)'
          : 'linear-gradient(180deg, rgba(80, 183, 175, 0.12) 0%, rgba(80, 183, 175, 0.05) 60%, rgba(80, 183, 175, 0.02) 100%)'
      }}
    >
      {/* Decorative Shapes: moved req.png to top-left; removed sm-shape.png */}
      <Image
        src={language === 'en' ? '/req_en.png' : '/req.png'}
        alt="decorative"
        width={384}
        height={384}
        priority
        sizes="(max-width: 640px) 160px, (max-width: 1024px) 256px, 384px"
        className={`left-shape absolute top-0 ${isRTL ? 'left-0 -translate-y-1/4 -translate-x-1/4' : 'right-0 -translate-y-1/4 translate-x-1/4'} w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 object-contain opacity-75 pointer-events-none z-0`}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center min-h-[70vh] lg:min-h-[80vh] relative z-10">
        <div
          className={`flex flex-col-reverse ${isRTL ? 'lg:flex-row' : 'lg:flex-row'} items-center justify-between gap-12 w-full`}
        >
          <div
            className={`w-full lg:w-6/12 text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'} space-y-6`}
          >
            {/* mobile logo removed per request */}

            <h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${language === 'en' ? 'font-latin' : ''}`}
              style={{
                color: ACCENT_PRIMARY
              }}
            >
              <span className="block">
                {heroContent?.title ?? ''}
              </span>
            </h1>
            
            <p 
              className={`text-lg sm:text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0 ${language === 'en' ? 'font-latin' : ''}`}
              style={{
                color: isDark ? '#a3f2ec' : '#3a6d69'
              }}
            >
              {heroContent?.subtitle ?? ''}
            </p>

            <div className={`hero-btn-groups flex flex-col sm:flex-row ${isRTL ? 'sm:flex-row' : ''} gap-4 sm:gap-6 justify-center ${isRTL ? 'lg:justify-start' : 'lg:justify-start'} items-center pt-2`}
            >
              <button
                onClick={() => {
                  const link = heroPrimaryLink;
                  if (link) return handleLink(link);
                  return scrollToSection('contact');
                }}
                className="main-btn px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent transform hover:-translate-y-1 whitespace-nowrap min-w-[200px] text-center flex items-center justify-center shadow-lg"
                style={{
                    background: BUTTON_COLOR
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = BUTTON_COLOR_DARKER;
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = BUTTON_COLOR;
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                {heroContent?.ctaPrimary ?? ''}
              </button>
              
              <a
                href={heroSecondaryLink ?? '#services'}
                onClick={(e) => {
                  e.preventDefault();
                  const link = heroSecondaryLink;
                  if (link) return handleLink(link);
                  return scrollToSection('services');
                }}
                className="sco-hero relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg md:text-xl font-semibold rounded-full border-2 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                style={{
                  color: BUTTON_COLOR,
                  borderColor: `${BUTTON_COLOR}80`,
                  background: 'transparent',
                  boxShadow: `0 10px 24px -18px ${BUTTON_COLOR_FRAME}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = BUTTON_COLOR_LIGHT;
                  e.currentTarget.style.borderColor = BUTTON_COLOR;
                  e.currentTarget.style.color = BUTTON_COLOR_DARKER;
                  e.currentTarget.style.boxShadow = `0 12px 28px -16px ${BUTTON_COLOR_FRAME}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = `${BUTTON_COLOR}80`;
                  e.currentTarget.style.color = BUTTON_COLOR;
                  e.currentTarget.style.boxShadow = `0 10px 24px -18px ${BUTTON_COLOR_FRAME}`;
                }}
              >
                {heroContent?.ctaSecondary ?? ''}
              </a>
            </div>

            {/* Certification Logos */}
            <div className={`flex logos flex-wrap gap-4 sm:gap-6 mt-8 opacity-90 ${isRTL ? 'justify-center lg:justify-start' : 'justify-center lg:justify-start'} items-center`}
            >
              <Image 
                src="/Certificate/EQPC Badge رخصة.png" 
                alt="EQPC Certification" 
                width={96}
                height={96}
                sizes="96px"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-md"
              />
              <Image 
                src="/Certificate/AQai Certification Badge.png" 
                alt="AQai Certification" 
                width={96}
                height={96}
                sizes="96px"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain drop-shadow-md"
              />
            </div>
          </div>

          <div className="w-full lg:w-5/12 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="absolute -top-6 -right-6 w-24 h-24 sm:w-36 sm:h-36 rounded-full border-4 border-[#50b7af]/30 backdrop-blur-sm" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-32 sm:h-32 rounded-3xl bg-[#50b7af]/10" />
              <Image 
                src="/Profile_image.png" 
                alt="Coach Amjaad"
                width={640}
                height={640}
                priority
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 400px, 480px"
                className="relative z-10 w-full rounded-[2.5rem] shadow-2xl object-contain bg-white/80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#50b7af]/30 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;