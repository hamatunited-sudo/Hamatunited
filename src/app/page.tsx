'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TrustedByMarquee from '@/components/TrustedByMarquee';
import Stats from '@/components/Stats';
import WhyChooseMe from '@/components/WhyChooseMe';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Socials from '@/components/Socials';
import Footer from '@/components/Footer';
import CTABar from '@/components/CTABar';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SplashScreen from '@/components/SplashScreen';
import SectionSeparator from '@/components/SectionSeparator';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <Navbar />
      <main>
        {/* 1- المقدمة */}
        <Hero />
        <SectionSeparator />
        {/* 2- عني */}
        <About />
        <SectionSeparator />
        {/* 3-الشركات */}
        <TrustedByMarquee />
        <SectionSeparator />
        {/* 4-الأرقام */}
        <Stats />
        <SectionSeparator />
        {/* 5-ما يميزني */}
        <WhyChooseMe />
        <SectionSeparator />
        {/* 6-الخدمات */}
  <Services />
        <SectionSeparator />
        {/* 7-آراء العملاء */}
        <Testimonials />
        <SectionSeparator />
        {/* 8-الأسئلة الشائعة */}
  <FAQ />
        <SectionSeparator />
        {/* 9-تابعني */}
        <Socials />
      </main>
      {/* 10- خاتمة */}
  <Footer />
      <CTABar />
      <WhatsAppFloat />
    </>
  );
}
