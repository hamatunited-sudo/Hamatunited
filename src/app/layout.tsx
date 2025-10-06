import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google';
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider } from "../contexts/UnifiedThemeContext";
import ButtonSelector from '@/components/ButtonSelector';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: '--font-noto-arabic',
  // include arabic subset so glyphs render consistently on all platforms
  subsets: ['arabic', 'latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'أفضل شركة حقن تربة في الدمام | شركة هامات يوناتيد – فحص وضمان 10 سنوات',
  description:
    'شركة هامات يوناتيد – خبرة في حقن التربة بالدمام مع ضمان 10 سنوات وفحص شامل قبل وبعد التنفيذ. خدمات معتمدة في اختبارات التربة، الصخور، الخرسانة، الأسفلت، وضبط الجودة. اتصل بنا الآن على +966 13 565 0006.',
  keywords:
    'حقن التربة, شركة هامات يوناتيد, مختبر فحص تربة الدمام, اختبارات التربة, اختبارات الصخور, اختبارات الخرسانة, ضبط الجودة, ضمان عشر سنوات, الدراسات الجيوتقنية, فحص التربة قبل البناء',
  metadataBase: new URL('https://www.hamatex.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      {
        url: '/HAMAT logo.svg',
        sizes: '32x32',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        url: '/HAMAT logo.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      }
    ],
    shortcut: '/favicon.ico',
    apple: {
      url: '/HAMAT logo.svg',
      sizes: '180x180',
      type: 'image/svg+xml',
    },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'أفضل شركة حقن تربة في الدمام | شركة هامات يوناتيد – فحص وضمان 10 سنوات',
    description:
      'شركة هامات يوناتيد – خبرة في حقن التربة بالدمام مع ضمان 10 سنوات وفحص شامل قبل وبعد التنفيذ. خدمات معتمدة في اختبارات التربة، الصخور، الخرسانة، الأسفلت، وضبط الجودة. اتصل بنا الآن على +966 13 565 0006.',
    url: 'https://www.hamatex.com',
    siteName: 'شركة هامات يوناتيد',
    type: 'website',
    locale: 'ar_SA',
    images: [
      {
        url: '/HAMAT logo.svg',
        alt: 'شعار شركة هامات يوناتيد',
        type: 'image/svg+xml',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'أفضل شركة حقن تربة في الدمام | شركة هامات يوناتيد – فحص وضمان 10 سنوات',
    description:
      'شركة هامات يوناتيد – خبرة في حقن التربة بالدمام مع ضمان 10 سنوات وفحص شامل قبل وبعد التنفيذ. خدمات معتمدة في اختبارات التربة، الصخور، الخرسانة، الأسفلت، وضبط الجودة. اتصل بنا الآن على +966 13 565 0006.',
    images: ['/HAMAT logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
    <link rel="icon" type="image/x-icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/HAMAT logo.svg" />
    <link rel="icon" type="image/svg+xml" sizes="192x192" href="/HAMAT logo.svg" />
    <link rel="image_src" href="/HAMAT logo.svg" />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Force light theme only - no dark mode
                  const htmlEl = document.documentElement;
                  
                  // Always set light theme
                  htmlEl.classList.remove('dark');
                  htmlEl.classList.add('light');
                  htmlEl.setAttribute('data-theme', 'light');
                  
                  // Set light theme CSS variables immediately
                  htmlEl.style.setProperty('--background', '0 0% 100%');
                  htmlEl.style.setProperty('--foreground', '0 0% 9%');
                  
                  // Store light theme preference
                  localStorage.setItem('theme', 'light');
                  
                } catch (e) {
                  console.warn('Theme initialization failed:', e);
                  // Even on error, force light theme
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${notoArabic.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <LanguageProvider>
            <ButtonSelector />
            <WhatsAppFloat />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
