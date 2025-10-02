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
            style={{ backgroundColor: '#fb6a44' }}
          />
          
          {/* Main Button */}
          <button
            onClick={handleWhatsAppClick}
            className="relative w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            style={{ backgroundColor: '#fb6a44' }}
            title={whatsappButtonTitle}
          >
            {/* WhatsApp Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <g transform="translate(2, 2)">
                  <path d="M17.472 2.59a10.01 10.01 0 00-7.065-2.929C4.671-.339-.341 4.671-.341 10.407c0 1.832.478 3.627 1.387 5.203L0 20l4.503-1.018a10.02 10.02 0 005.033 1.371c5.736 0 10.407-4.672 10.407-10.408A10.364 10.364 0 0017.472 2.59zM10.436 18.48c-1.552 0-3.066-.42-4.389-1.21l-.314-.186-3.26.854.87-3.178-.204-.326a8.353 8.353 0 01-1.28-4.458c0-4.62 3.758-8.379 8.379-8.379 2.238 0 4.34.872 5.921 2.454a8.325 8.325 0 012.454 5.921c-.001 4.621-3.759 8.508-8.377 8.508zm4.594-6.272c-.252-.126-1.49-.735-1.72-.82-.231-.084-.4-.126-.568.127-.168.252-.65.82-.797.987-.147.168-.294.19-.546.063-.252-.126-1.064-.392-2.026-1.25-.749-.668-1.255-1.492-1.403-1.744-.147-.252-.016-.388.111-.513.114-.113.252-.294.378-.441.126-.147.168-.252.252-.42.084-.168.042-.315-.021-.441-.063-.126-.568-1.367-.778-1.871-.204-.49-.412-.424-.568-.432a10.89 10.89 0 00-.484-.009c-.168 0-.441.063-.672.315-.231.252-.882.862-.882 2.101s.903 2.434 1.029 2.602c.126.168 1.832 2.797 4.437 3.921.62.267 1.105.426 1.483.546.623.198 1.19.17 1.638.103.5-.075 1.49-.609 1.7-1.196.21-.588.21-1.092.147-1.196-.063-.105-.231-.168-.483-.294z"/>
                </g>
              </svg>
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
