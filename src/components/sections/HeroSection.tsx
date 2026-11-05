import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { SectionId } from '../../types';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onNavigateSection?: (sectionId: SectionId) => void;
  onHeroReady?: () => void;
  isHeroActive?: boolean;
  onActivateHero?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onNavigateSection,
  onHeroReady,
  isHeroActive: isHeroActiveProp,
  onActivateHero,
}) => {
  const [internalIsHeroActive, setInternalIsHeroActive] = useState(false);
  const isHeroActive = isHeroActiveProp !== undefined ? isHeroActiveProp : internalIsHeroActive;

  const activateHero = useCallback(() => {
    if (onActivateHero) onActivateHero();
    setInternalIsHeroActive(true);
    if (onHeroReady) onHeroReady();
  }, [onActivateHero, onHeroReady]);

  useEffect(() => {
    if (isHeroActive) return;
    const handleClick = () => activateHero();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') activateHero();
    };
    window.addEventListener('click', handleClick);
    window.addEventListener('touchend', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchend', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHeroActive, activateHero]);

  const { scrollYProgress } = useScroll();
  const backgroundScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.03]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, -45]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <section
      id="home"
      onClick={activateHero}
      style={{ scrollSnapAlign: 'start' }}
      className={`relative h-screen min-h-[560px] md:min-h-[640px] w-full p-2.5 sm:p-3 md:p-4 flex flex-col items-center justify-center overflow-hidden select-none bg-[#F7F8FA] ${
        !isHeroActive ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/*
        Hero Showcase Card: Enclosed in a clean border frame with rounded corners on all four sides.
        Strictly zero fades or dissolves — the entire scene remains vivid, crisp, and edge-to-edge.
      */}
      <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-300/80 shadow-[0_4px_24px_rgba(15,23,42,0.06)] flex flex-col items-center justify-center">
        {/* Layer 0: Scenery Background */}
        <motion.img
          src="/assets/hero.png"
          alt=""
          aria-hidden="true"
          style={{ scale: backgroundScale }}
          className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_bottom] scale-[1.20] sm:scale-[1.14] md:scale-100 origin-[50%_80%] md:origin-bottom -translate-y-4 sm:-translate-y-5 md:translate-y-0 transition-transform duration-700 ease-out z-0"
          loading="eager"
        />

        {/* Ultra-gentle ambient luminance */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/[0.04] via-transparent to-transparent pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* Layer 2: Foreground Character Cutout & Meadow Grass */}
        <motion.img
          src="/assets/Serene_Meadow_Foreground_Character.png"
          alt=""
          aria-hidden="true"
          style={{ scale: backgroundScale }}
          className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_bottom] scale-[1.20] sm:scale-[1.14] md:scale-100 origin-[50%_80%] md:origin-bottom -translate-y-4 sm:-translate-y-5 md:translate-y-0 pointer-events-none select-none z-20 transition-transform duration-700 ease-out"
          loading="eager"
        />

        {/*
          Central Typographic Storytelling Plane
        */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className={`relative z-30 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center justify-center shrink-0 pt-16 sm:pt-18 md:pt-20 pb-[calc(max(38vh,21vw)+24px)] md:pb-[calc(max(37vh,20.8vw)+36px)] transition-all duration-500 ease-out ${
            isHeroActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isHeroActive ? 1 : 0, y: isHeroActive ? 0 : 16 }}
            transition={{ duration: 0.65, delay: isHeroActive ? 0.25 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="mb-[clamp(0.85rem,1.8vh,1.5rem)]"
          >
            <h1
              className="select-none tracking-[-0.035em] leading-[1.06] font-medium mx-auto max-w-none text-balance text-white text-[clamp(1.75rem,7.4vw,2.35rem)] md:text-[clamp(3.25rem,5.2vw,5.5rem)]"
              style={{ color: '#FFFFFF' }}
            >
              <span className="block whitespace-nowrap">Technology should</span>
              <span className="block whitespace-nowrap font-bold">understand humanity.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: isHeroActive ? 1 : 0, y: isHeroActive ? 0 : 12, scale: isHeroActive ? 1 : 0.95 }}
            transition={{ duration: 0.5, delay: isHeroActive ? 0.45 : 0, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <button
              type="button"
              onClick={onExploreClick}
              className="px-[clamp(1.5rem,2.5vw,2.15rem)] py-[clamp(0.6rem,1.1vh,0.85rem)] rounded-full text-[clamp(0.8125rem,0.9vw,0.9375rem)] font-semibold text-white bg-[#0F294D] hover:bg-[#174B91] transition-all cursor-pointer shadow-[0_8px_24px_rgba(15,41,77,0.22)] active:scale-95"
            >
              Try Mythri
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
