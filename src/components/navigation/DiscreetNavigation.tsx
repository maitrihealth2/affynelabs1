import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { SectionId } from '../../types';

interface DiscreetNavigationProps {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  scrollProgress: number;
  heroScrollProgress?: number;
  isHeroActive: boolean;
  onActivateHero: () => void;
}

export const DiscreetNavigation: React.FC<DiscreetNavigationProps> = ({
  activeSection,
  onNavigate,
  scrollProgress,
  heroScrollProgress = 0,
  isHeroActive,
  onActivateHero,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Auto-close menu when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  // Click outside detection to collapse menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleItemClick = (id: SectionId) => {
    onNavigate(id);
    setIsMenuOpen(false);
  };

  const isNavActive = isHeroActive || scrollProgress > 0.02 || heroScrollProgress > 0.04;

  return (
    <>
      {/* 
        Unified Morphing Brand Wordmark & Top-Center Bilateral Navigation Menu:
        State A (Intro): Starts monumental and centered behind foreground character (top: 50%, y: -50%, z: 15).
        State B (Active): Morphs up to top-center (top: 20px, y: 0, z: 50) as our interactive menu button.
        When clicked at top-center: Bilateral menu expands horizontally on both sides equally in one line.
      */}
      <motion.div
        ref={navRef}
        initial={false}
        animate={{
          top: isNavActive ? 20 : '50%',
          x: '-50%',
          y: isNavActive ? 0 : '-50%',
        }}
        transition={{
          duration: 0.85,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: 'fixed',
          left: '50%',
          zIndex: isNavActive ? 50 : 15,
        }}
        className="pointer-events-auto select-none flex flex-col items-center"
      >
        <AnimatePresence mode="wait">
          {!isNavActive ? (
            /* STATE A: Monumental Centered Brand Wordmark */
            <motion.button
              key="monumental-intro-brand"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6, y: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={onActivateHero}
              className="flex flex-col items-center justify-center text-center focus:outline-none cursor-pointer w-screen max-w-7xl px-4"
              aria-label="Enter Affyne Labs"
            >
              <span className="text-[17vw] sm:text-[15vw] md:text-[13vw] lg:text-[11.5vw] xl:text-[160px] 2xl:text-[185px] font-black tracking-[-0.04em] leading-none text-white drop-shadow-[0_4px_32px_rgba(10,30,60,0.22)] block">
                affynelabs
              </span>
            </motion.button>
          ) : (
            /* STATE B: Top-Center Interactive Menu Button & Bilateral Expansion */
            <motion.div
              key="top-center-menu"
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center"
            >
              {/* DESKTOP/TABLET: Bilateral Left Wing (Anchored absolutely to the left of the button) */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    key="left-wing"
                    initial={{ opacity: 0, x: 14, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 14, scale: 0.94 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden sm:flex absolute right-full mr-2.5 sm:mr-3.5 top-1/2 -translate-y-1/2 origin-right items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_30px_rgba(12,26,48,0.10)] whitespace-nowrap"
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick('who-we-are')}
                      className={`px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                        activeSection === 'who-we-are'
                          ? 'text-[#1A56DB] font-semibold bg-blue-50/80'
                          : 'text-[#475569] hover:text-[#0C1A30] hover:bg-slate-100/80'
                      }`}
                    >
                      Who We Are
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('foundation')}
                      className={`px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                        activeSection === 'foundation'
                          ? 'text-[#1A56DB] font-semibold bg-blue-50/80'
                          : 'text-[#475569] hover:text-[#0C1A30] hover:bg-slate-100/80'
                      }`}
                    >
                      Foundation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('what-we-do')}
                      className={`px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                        activeSection === 'what-we-do'
                          ? 'text-[#1A56DB] font-semibold bg-blue-50/80'
                          : 'text-[#475569] hover:text-[#0C1A30] hover:bg-slate-100/80'
                      }`}
                    >
                      What We Do
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CENTER: STANDALONE INDIVIDUAL AFFYNELABS PILL (Stationary Anchor) */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative z-20 flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-white/95 hover:bg-white backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_30px_rgba(12,26,48,0.10)] hover:shadow-lg transition-all duration-200 cursor-pointer group focus:outline-none shrink-0 ${
                  isMenuOpen ? 'ring-2 ring-[#1A56DB]/20 bg-white' : ''
                }`}
                aria-label={isMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                title={isMenuOpen ? 'Click to close menu' : 'Click to open menu'}
              >
                <span className="text-sm font-bold tracking-tight text-[#0C1A30] group-hover:text-[#1A56DB] transition-colors">
                  affynelabs
                </span>
                <AnimatePresence mode="wait">
                  {isMenuOpen && (
                    <motion.span
                      key="close-icon"
                      initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      className="text-xs text-[#64748B] group-hover:text-[#0C1A30] font-normal leading-none"
                    >
                      ✕
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* DESKTOP/TABLET: Bilateral Right Wing (Anchored absolutely to the right of the button) */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    key="right-wing"
                    initial={{ opacity: 0, x: -14, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -14, scale: 0.94 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden sm:flex absolute left-full ml-2.5 sm:ml-3.5 top-1/2 -translate-y-1/2 origin-left items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_8px_30px_rgba(12,26,48,0.10)] whitespace-nowrap"
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick('mythri')}
                      className={`px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                        activeSection === 'mythri'
                          ? 'text-[#1A56DB] font-semibold bg-blue-50/80'
                          : 'text-[#475569] hover:text-[#0C1A30] hover:bg-slate-100/80'
                      }`}
                    >
                      Mythri
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('contact')}
                      className={`px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium transition-colors cursor-pointer ${
                        activeSection === 'contact'
                          ? 'text-[#1A56DB] font-semibold bg-blue-50/80'
                          : 'text-[#475569] hover:text-[#0C1A30] hover:bg-slate-100/80'
                      }`}
                    >
                      Contact
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('mythri')}
                      className="inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-[13px] font-semibold text-white bg-[#0F294D] hover:bg-[#174B91] shadow-xs hover:shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      Try Mythri
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* MOBILE DROPDOWN (Screen width < 640px) */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    key="mobile-menu"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="sm:hidden absolute top-full mt-2.5 left-1/2 -translate-x-1/2 w-64 rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-2.5 flex flex-col gap-1 z-30"
                  >
                    <button
                      type="button"
                      onClick={() => handleItemClick('who-we-are')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        activeSection === 'who-we-are' ? 'text-[#1A56DB] bg-blue-50/80 font-semibold' : 'text-[#475569] hover:bg-slate-100/80'
                      }`}
                    >
                      Who We Are
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('foundation')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        activeSection === 'foundation' ? 'text-[#1A56DB] bg-blue-50/80 font-semibold' : 'text-[#475569] hover:bg-slate-100/80'
                      }`}
                    >
                      Foundation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('what-we-do')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        activeSection === 'what-we-do' ? 'text-[#1A56DB] bg-blue-50/80 font-semibold' : 'text-[#475569] hover:bg-slate-100/80'
                      }`}
                    >
                      What We Do
                    </button>
                    <div className="h-px bg-slate-100 my-1" />
                    <button
                      type="button"
                      onClick={() => handleItemClick('mythri')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        activeSection === 'mythri' ? 'text-[#1A56DB] bg-blue-50/80 font-semibold' : 'text-[#475569] hover:bg-slate-100/80'
                      }`}
                    >
                      Mythri
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('contact')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        activeSection === 'contact' ? 'text-[#1A56DB] bg-blue-50/80 font-semibold' : 'text-[#475569] hover:bg-slate-100/80'
                      }`}
                    >
                      Contact
                    </button>
                    <button
                      type="button"
                      onClick={() => handleItemClick('mythri')}
                      className="w-full text-center px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#0F294D] hover:bg-[#174B91] mt-1 shadow-sm"
                    >
                      Try Mythri
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
