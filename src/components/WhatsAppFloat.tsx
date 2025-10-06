'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/UnifiedThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const WhatsAppFloat = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isPulse, setIsPulse] = useState(true);
  const { language, content } = useLanguage();
  const whatsappConfig = content?.whatsapp ?? {};
  const defaultWhatsappUI = content?.ui?.whatsapp?.ar ?? {};
  const whatsappUI = content?.ui?.whatsapp?.[language] ?? defaultWhatsappUI;
  const whatsappButtonTitle = whatsappUI.buttonTitle ?? defaultWhatsappUI.buttonTitle ?? '';
  const whatsappTooltip = whatsappUI.tooltip ?? defaultWhatsappUI.tooltip ?? '';

  useEffect(() => {
    // Show the button after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Create pulse animation interval
    const pulseInterval = setInterval(() => {
      setIsPulse(true);
      setTimeout(() => setIsPulse(false), 1000);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(pulseInterval);
    };
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = whatsappConfig.phone?.replace?.(/\D+/g, '') ?? '';
    const message = language === 'ar'
      ? whatsappConfig.message_ar ?? whatsappConfig.message_en ?? ''
      : whatsappConfig.message_en ?? whatsappConfig.message_ar ?? '';

    if (!phoneNumber) {
      return;
    }

    const template = whatsappConfig.urlTemplate ?? 'https://wa.me/{{phone}}?text={{message}}';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = template
      .replace('{{phone}}', phoneNumber)
      .replace('{{message}}', encodedMessage);

    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="relative">
          {/* Pulse Animation Ring */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              isPulse ? 'animate-ping opacity-75' : 'opacity-0'
            }`}
            style={{ backgroundColor: 'rgba(70,37,10,0.15)' }}
          />
          
          {/* Main Button */}
          <button
            onClick={handleWhatsAppClick}
            className="relative w-16 h-16 rounded-full transition-all duration-300 hover:scale-110 group"
            style={{ backgroundColor: '#46250A' }}
            title={whatsappButtonTitle}
          >
            {/* WhatsApp Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-10 h-10" />
            </div>

            {/* Notification Dot removed */}
          </button>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'} px-3 py-2 rounded-lg text-sm whitespace-nowrap relative`}>
              {whatsappTooltip}
              {/* Arrow */}
              <div className="absolute left-0 top-1/2 transform translate-x-full -translate-y-1/2">
                <div className={`w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent ${isDark ? 'border-r-gray-800' : 'border-r-gray-200'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bounce Animation Keyframes */}
      <style jsx global>{`
        @keyframes whatsapp-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        .animate-whatsapp-bounce {
          animation: whatsapp-bounce 2s infinite;
        }
      `}</style>
    </>
  );
};

export default WhatsAppFloat;
