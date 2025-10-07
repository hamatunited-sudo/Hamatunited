'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import WhyChooseMe from '@/components/WhyChooseMe';
import Process from '@/components/Process';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import SectionSeparator from '@/components/SectionSeparator';

export default function Home() {
  return (
    <>
      <Navbar />
  <main className="bg-white text-[#134333]">
    <Hero />
    <SectionSeparator />
    <About />
    <SectionSeparator />
    <Services />
    <SectionSeparator />
    <WhyChooseMe />
    <SectionSeparator />
    <Process />
    <SectionSeparator />
    <BlogSection />
      </main>
      <Footer />
    </>
  );
}
