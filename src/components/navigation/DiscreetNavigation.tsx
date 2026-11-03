import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { SectionId } from '../../types';

interface DiscreetNavigationProps {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  scrollProgress: number; // 0 to 1 across entire page
  heroScrollProgress?: number;
  showNav?: boolean;
}

interface NavItem {
  id: SectionId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'who-we-are', label: 'Who We Are' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'what-we-do', label: 'What We Do' },
  { id: 'mythri', label: 'Mythri' },
  { id: 'contact', label: 'Contact' },
];

export const DiscreetNavigation: React.FC<DiscreetNavigationProps> = ({
  activeSection,
  onNavigate,
  scrollProgress,
  heroScrollProgress = 0,
  showNav = true,
}) => {
  const isHero = activeSection === 'home' && (heroScrollProgress < 0.65 || scrollProgress < 0.08);
  const [isPullDownOpen, setIsPullDownOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Auto-hide when scrolling so navigation never obstructs content
  useEffect(() => {
    const handleScroll = () => {
      setIsPullDownOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hover detection: pull down when cursor reaches top edge (<55px), slide up when cursor moves away (>100px)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 55) {
        setIsPullDownOpen(true);
      } else if (e.clientY > 105 && !navRef.current?.contains(e.target as Node)) {
        setIsPullDownOpen(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle navigation: shift section and automatically slide nav back up
  const handleItemClick = (id: SectionId) => {
    onNavigate(id);
    setIsPullDownOpen(false);
  };

  return (
    <>
      {/* 
        Hover detection trigger strip at the very top edge:
        Unobtrusive, completely transparent, detects cursor hover to slide down nav
      */}
      <div
        className="fixed top-0 left-0 right-0 h-10 z-40 pointer-events-auto"
        onMouseEnter={() => setIsPullDownOpen(true)}
      />

      {/* 
        Persistent Minimal Top Left Brand Wordmark:
        Always floating cleanly without any bar or block behind it
      */}
      <div
        className={`fixed top-5 left-6 sm:left-10 lg:left-16 z-40 select-none pointer-events-auto transition-all duration-700 ${
          showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <button
          onClick={() => handleItemClick('home')}
          className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] hover:text-[#174B91] transition-colors focus:outline-none cursor-pointer"
        >
          affynelabs
        </button>
      </div>

      {/* 
        Pull-Down Auto-Hiding Navigation Bar:
        Slides down when cursor reaches top of screen;
        Automatically slides back up when scrolling or when a section is selected
      */}
      <div
        ref={navRef}
        onMouseEnter={() => setIsPullDownOpen(true)}
        onMouseLeave={() => setIsPullDownOpen(false)}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
          isPullDownOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto scale-100'
            : '-translate-y-16 opacity-0 pointer-events-none scale-95'
        }`}
      >
        <nav
          aria-label="Desktop Pull-Down Navigation"
          className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg shadow-slate-900/5 select-none"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#174B91] text-white font-semibold shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-100/70 font-medium'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          <button
            onClick={() => handleItemClick('mythri')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#102E57] hover:bg-[#174B91] px-3.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
          >
            <span>Waitlist</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </nav>
      </div>

      {/* Mobile navigation bar removed per request */}
    </>
  );
};
