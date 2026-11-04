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

  // Smooth navigation to a specific section
  const scrollToSection = useCallback((sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Scroll listener to update progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
      setScrollProgress(progress);

      // Hero scroll progress (first viewport height)
      const heroHeight = window.innerHeight;
      const heroProg = Math.min(1, Math.max(0, scrollY / heroHeight));
      setHeroScrollProgress(heroProg);

      // Determine active section based on scroll offsets
      const sections: SectionId[] = [
        'home',
        'who-we-are',
        'foundation',
        'what-we-do',
        'mythri',
        'contact',
      ];

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] text-[#202B38] font-sans antialiased overflow-x-hidden">
      {/* 
        Persistent Atmospheric Light Scene (Three.js WebGL)
        Renders delicate sunlit drifting particles catching morning light with subtle mouse parallax.
        Fades out cleanly when scrolled past the hero to preserve pure contrast for content sections.
      */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
          heroScrollProgress >= 0.95 ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <HeroEnvironmentScene
          scrollProgress={heroScrollProgress}
          isPortalActive={false}
        />
      </div>

      {/* 
        Morphing Top-Center Brand Navigation
        Starts centered & monumental behind character -> Morphs to top-center menu button
        Opens bilateral navigation options equally divided on both sides in one line
      */}
      <DiscreetNavigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
        scrollProgress={scrollProgress}
        heroScrollProgress={heroScrollProgress}
        isHeroActive={isHeroActive}
        onActivateHero={() => setIsHeroActive(true)}
      />

      {/* Main Experience Flow */}
      <main className="relative z-10">
        {/* 01: Home / Hero Experience with Subject Character & Atmospheric Window */}
        <HeroSection
          onExploreClick={() => scrollToSection('who-we-are')}
          onNavigateSection={scrollToSection}
          onHeroReady={() => setIsHeroReady(true)}
          isHeroActive={isHeroActive}
          onActivateHero={() => setIsHeroActive(true)}
        />

        {/* 02: Who We Are (Identity, Integrity, Responsibility) */}
        <WhoWeAreSection />

        {/* 03: Foundation (Purpose, Vision, Mission, Philosophy) */}
        <FoundationSection />

        {/* 04: What We Do (5 Core Activities & Disciplines in Single Desktop Viewport) */}
        <WhatWeDoSection />

        {/* 05: Mythri (Early Access & Product Horizon Waiting List) */}
        <WaitingListSection />

        {/* 06: Contact Us (Direct Dialogue & Clinical Partnerships) */}
        <ContactSection onNavigate={scrollToSection} />

        {/* 07: Monumental Brand Finale & Interactive 3D Orbiting Footer */}
        <FooterSection onNavigate={scrollToSection} />
      </main>
    </div>
  );
}
