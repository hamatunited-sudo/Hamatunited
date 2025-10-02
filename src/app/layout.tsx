import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider } from "../contexts/UnifiedThemeContext";

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
  title: "Coach Amjaad - Professional Development & Emotional Intelligence",
  description: 'Your Success Partner - Empowering Your Journey to Confidence and Excellence. Expert coaching in performance, productivity, and emotional intelligence.',
  keywords: "coaching, emotional intelligence, professional development, leadership, performance coaching, Saudi Arabia, أمجاد قانديه, كوتشينج, ذكاء عاطفي",
  metadataBase: new URL('https://coachamjaad.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        url: '/Logo.png',
        sizes: '192x192',
        type: 'image/png',
      }
    ],
    shortcut: '/favicon.ico',
    apple: {
      url: '/Logo.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'مهند الغامدي',
    // no description as requested
    url: 'https://mohcareer.com',
    siteName: 'MoCareer',
    type: 'website',
    locale: 'ar_SA',
    images: [
      {
        url: '/Logo_Splash.png',
        alt: 'مهند الغامدي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مهند الغامدي',
    images: ['/Logo_Splash.png'],
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
        <link rel="apple-touch-icon" sizes="180x180" href="/Logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/Logo.png" />
  <link rel="image_src" href="/Logo_Splash.png" />
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
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
