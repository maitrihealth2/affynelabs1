import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { WordByWordTypography } from '../typography/WordByWordTypography';
import type { SectionId } from '../../types';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onNavigateSection?: (sectionId: SectionId) => void;
  showContent?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onNavigateSection,
  showContent = true,
}) => {
  // Scroll parallax depth transformations
  const { scrollYProgress } = useScroll();
  const backgroundScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.03]);
  const contentY = useTransform(scrollYProgress, [0, 0.28], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <section
      id="home"
      className="relative h-screen min-h-[580px] md:min-h-[680px] w-full flex flex-col justify-between overflow-hidden select-none"
    >
      {/* 
        Full-Viewport Cinematic Environmental Backdrop
        The authentic Dreamy Mountain Meadow Reverie artwork fills the entire hero seamlessly
        from top to bottom with zero cuts, seams, or borders.
      */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.img
          src="/assets/Serene_Meadow_Above_Misty_Mountains.png"
          alt="Serene meadow above misty mountains"
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
          style={{ scale: backgroundScale }}
          className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_bottom] scale-[1.20] sm:scale-[1.14] md:scale-100 origin-[50%_80%] md:origin-bottom -translate-y-4 sm:-translate-y-5 md:translate-y-0 pointer-events-none select-none z-10 transition-transform duration-700 ease-out"
        />

        {/* Ethereal morning mist dissolve seamlessly transitioning into Section 02 (#ffffff) */}
        <div
          className="absolute -bottom-[2px] left-0 right-0 h-36 sm:h-48 md:h-60 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.68) 70%, rgba(255,255,255,0.92) 88%, #ffffff 100%)'
          }}
          aria-hidden="true"
        />
      </div>

      {/* Top spacing: flexible on mobile for vertical centering, fixed on desktop for nav clearance */}
      <div className="flex-1 md:flex-none md:h-16 lg:h-20 shrink-0" aria-hidden="true" />

      {/* 
        Central Typographic Storytelling & Waitlist Plane:
        Perfectly centered on mobile; upper-middle on desktop with balanced spacing.
      */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className={`z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 text-center shrink-0 pt-0 md:pt-10 lg:pt-12 pb-0 md:pb-4 transition-all duration-500 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {/* Balanced Two-Line Display Headline with White Metallic Finish */}
        <div className="mb-4 sm:mb-5 md:mb-7">
          <h1
            className="text-3xl xs:text-[34px] sm:text-4xl md:text-5xl lg:text-[70px] xl:text-[74px] font-medium tracking-[-0.03em] leading-[1.14] sm:leading-[1.1] md:leading-[1.06] text-balance max-w-xs xs:max-w-sm sm:max-w-xl md:max-w-3xl mx-auto select-none"
            style={{
              background:
                'linear-gradient(175deg, #FFFFFF 0%, #FFFFFF 22%, #E6F0FD 40%, #B2D3FA 55%, #FFFFFF 70%, #F5E6FB 84%, #CFE3FC 94%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter:
                'drop-shadow(0 1px 1px rgba(255, 255, 255, 0.95)) drop-shadow(0 3px 6px rgba(8, 28, 68, 0.48)) drop-shadow(0 10px 28px rgba(12, 38, 90, 0.30))',
            }}
          >
            Technology should <br />
            <span className="font-bold">understand humanity.</span>
          </h1>
        </div>

        {/* 
          CTA Button: Try Mythri
          Positioned immediately beneath the headline with comfortable, unified spacing
        */}
        <div className="flex justify-center">
          <button
            type="button"
            className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#0F294D] hover:bg-[#174B91] transition-all cursor-pointer shadow-[0_8px_24px_rgba(15,41,77,0.18)] active:scale-95"
          >
            Try Mythri
          </button>
        </div>
      </motion.div>

      {/* Bottom spacing: flexible on mobile for vertical centering, generous open lower space on desktop */}
      <div className="flex-1 pointer-events-none md:min-h-[180px] lg:min-h-[200px]" aria-hidden="true" />
    </section>
  );
};

