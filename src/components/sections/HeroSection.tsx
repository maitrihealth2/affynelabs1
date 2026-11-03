import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { SectionId } from '../../types';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onNavigateSection?: (sectionId: SectionId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onNavigateSection,
}) => {
  // Scroll parallax depth transformations
  const { scrollYProgress } = useScroll();
  const backgroundScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.03]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, -45]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <section
      id="home"
      className="relative h-screen min-h-[560px] md:min-h-[640px] w-full flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* 
        Full-Viewport Cinematic Environmental Backdrop
        The authentic Dreamy Mountain Meadow Reverie artwork fills the entire hero seamlessly
        from top to bottom with zero cuts, seams, or borders.
      */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.img
          src="/assets/hero.png"
          alt="Serene meadow above misty mountains"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ scale: backgroundScale }}
          className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_bottom] scale-[1.20] sm:scale-[1.14] md:scale-100 origin-[50%_80%] md:origin-bottom -translate-y-4 sm:-translate-y-5 md:translate-y-0 transition-transform duration-700 ease-out z-0"
          loading="eager"
        />

        {/* 
          Ultra-gentle ambient luminance:
          Protects text contrast in the sky while preserving the natural colors and ethereal clouds
        */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/[0.04] via-transparent to-transparent pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* 
          Foreground Character Cutout & Meadow Grass:
          Ensures the character maintains authentic 3D spatial depth in the hero
        */}
        <motion.img
          src="/assets/Serene_Meadow_Foreground_Character.png"
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
          style={{ scale: backgroundScale }}
          className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_bottom] scale-[1.20] sm:scale-[1.14] md:scale-100 origin-[50%_80%] md:origin-bottom -translate-y-4 sm:-translate-y-5 md:translate-y-0 pointer-events-none select-none z-10 transition-transform duration-700 ease-out"
        />

        {/* Ethereal morning mist dissolve seamlessly transitioning into Section 02 (#ffffff) */}
        <div
          className="absolute -bottom-[2px] left-0 right-0 h-36 sm:h-48 md:h-60 pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.68) 70%, rgba(255,255,255,0.92) 88%, #ffffff 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* 
        Central Typographic Storytelling Plane:
        Dynamically aligns to any screen size (mobile, tablet, desktop) without overlapping.
        Bottom clearance scales proportionally with viewport height (26vh) so the headline
        and CTA button remain centered in the open sky above the character across all aspect ratios.
      */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center justify-center shrink-0 pt-16 sm:pt-20 md:pt-24 pb-[clamp(150px,26vh,260px)]"
      >
        {/* 
          Display Headline:
          Enters sequentially (delay: 0.35s).
          Fluid clamp font size fits mobile, tablet, and desktop continuously.
          whitespace-nowrap guarantees two balanced lines on every screen.
        */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[clamp(1rem,2.2vh,1.75rem)]"
        >
          <h1
            className="select-none tracking-[-0.035em] leading-[1.08] font-medium mx-auto max-w-none text-balance"
            style={{
              fontSize: 'clamp(1.85rem, 1.25rem + 3.2vw, 4.5rem)',
              background:
                'linear-gradient(175deg, #FFFFFF 0%, #FFFFFF 22%, #E6F0FD 40%, #B2D3FA 55%, #FFFFFF 70%, #F5E6FB 84%, #CFE3FC 94%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter:
                'drop-shadow(0 1px 1px rgba(255, 255, 255, 0.95)) drop-shadow(0 3px 6px rgba(8, 28, 68, 0.48)) drop-shadow(0 10px 28px rgba(12, 38, 90, 0.30))',
            }}
          >
            <span className="block whitespace-nowrap">Technology should</span>
            <span className="block whitespace-nowrap font-bold">understand humanity.</span>
          </h1>
        </motion.div>

        {/* 
          CTA Button: Try Mythri
          Enters sequentially after headline (delay: 0.55s).
          Proportional fluid padding and typography.
        */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center"
        >
          <button
            type="button"
            onClick={onExploreClick}
            className="px-[clamp(1.6rem,2.8vw,2.25rem)] py-[clamp(0.65rem,1.2vh,0.9rem)] rounded-full text-[clamp(0.8125rem,0.9vw,0.9375rem)] font-semibold text-white bg-[#0F294D] hover:bg-[#174B91] transition-all cursor-pointer shadow-[0_8px_24px_rgba(15,41,77,0.22)] active:scale-95"
          >
            Try Mythri
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

