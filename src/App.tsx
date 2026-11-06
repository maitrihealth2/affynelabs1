/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { HeroEnvironmentScene } from './components/3d/HeroEnvironmentScene';
import { DiscreetNavigation } from './components/navigation/DiscreetNavigation';
import { HeroSection } from './components/sections/HeroSection';
import { WhoWeAreSection } from './components/sections/WhoWeAreSection';
import { FoundationSection } from './components/sections/FoundationSection';
import { WhatWeDoSection } from './components/sections/WhatWeDoSection';
import { WaitingListSection } from './components/sections/WaitingListSection';
import { ContactSection } from './components/sections/ContactSection';
import { FooterSection } from './components/footer/FooterSection';
import type { SectionId } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [heroScrollProgress, setHeroScrollProgress] = useState<number>(0);
  const [isHeroReady, setIsHeroReady] = useState<boolean>(false);
  const [isHeroActive, setIsHeroActive] = useState<boolean>(false);

  // Always start at top on load
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // Lock scroll only while the initial landing gate is active
  useEffect(() => {
    if (!isHeroActive) {
      window.scrollTo(0, 0);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isHeroActive]);

  const scrollToSection = useCallback((sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
      setScrollProgress(progress);

      const heroHeight = window.innerHeight;
      const heroProg = Math.min(1, Math.max(0, scrollY / heroHeight));
      setHeroScrollProgress(heroProg);

      const sections: SectionId[] = ['home', 'who-we-are', 'foundation', 'what-we-do', 'mythri', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] text-[#202B38] font-sans antialiased overflow-x-hidden">
      {/* Persistent WebGL atmospheric scene behind hero */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
          heroScrollProgress >= 0.95 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <HeroEnvironmentScene scrollProgress={heroScrollProgress} isPortalActive={false} />
      </div>

      {/* Navigation */}
      <DiscreetNavigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
        scrollProgress={scrollProgress}
        heroScrollProgress={heroScrollProgress}
        isHeroActive={isHeroActive}
        onActivateHero={() => setIsHeroActive(true)}
      />

      {/* Main Experience Flow with Staggered Per-Element Reveals */}
      <main className="relative z-10 w-full min-w-0">
        {/* 01: Hero Experience */}
        <HeroSection
          onExploreClick={() => scrollToSection('who-we-are')}
          onNavigateSection={scrollToSection}
          onHeroReady={() => setIsHeroReady(true)}
          isHeroActive={isHeroActive}
          onActivateHero={() => setIsHeroActive(true)}
        />

        {/* 02: Who We Are */}
        <WhoWeAreSection />

        {/* 03: Foundation (Architectural 3D Pyramid) */}
        <FoundationSection />

        {/* 04: What We Do (Engineering Disciplines) */}
        <WhatWeDoSection />

        {/* 05: Mythri Waiting List */}
        <WaitingListSection />

        {/* 06: Contact Dialogue */}
        <ContactSection onNavigate={scrollToSection} />

        {/* 07: Monumental Footer */}
        <FooterSection onNavigate={scrollToSection} />
      </main>
    </div>
  );
}
