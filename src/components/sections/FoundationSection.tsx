import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';

interface FoundationCard {
  id: string;
  label: string;
  tagline: string;
  description: string;
  image: string;
  category: string;
}

const CARDS: FoundationCard[] = [
  {
    id: 'purpose',
    label: 'Purpose',
    category: 'Core Purpose',
    tagline: 'Bridging human vulnerability with thoughtful, accessible technology.',
    description:
      'We believe healthcare technology should feel calm, trustworthy, and respectful—built to protect human dignity across every clinical and daily interaction.',
    image: '/assets/card_bg_purpose.jpg',
  },
  {
    id: 'vision',
    label: 'Vision',
    category: 'Long-term Vision',
    tagline: 'Empathy, clarity, and trust.',
    description:
      'A future where computational intelligence serves genuine human emotional well-being without digital noise, synthetic addiction loops, or compromised boundaries.',
    image: '/assets/card_bg_vision.jpg',
  },
  {
    id: 'mission',
    label: 'Mission',
    category: 'Clinical Mission',
    tagline: 'Developing provably safe, privacy-first clinical technologies.',
    description:
      'We engineer computational systems where privacy is mathematically guaranteed rather than an optional toggle, serving patients and clinicians with unconditional safety.',
    image: '/assets/card_bg_mission.jpg',
  },
];

export const FoundationSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    setAnimatingCard(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % CARDS.length);
  }, [currentIndex]);

  const handleSelect = (index: number) => {
    if (index === currentIndex) return;
    setAnimatingCard(currentIndex);
    setCurrentIndex(index);
  };

  // Reset animatingCard after transition completes
  useEffect(() => {
    if (animatingCard !== null) {
      const timer = setTimeout(() => {
        setAnimatingCard(null);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [animatingCard]);

  // Auto-switch smoothly every 5.5s (no 50ms intervals, pure GPU animation)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  return (
    <section
      id="foundation"
      className="relative w-full min-h-screen px-6 sm:px-12 lg:px-20 pt-24 sm:pt-28 lg:py-14 pb-12 flex flex-col justify-center overflow-hidden select-none bg-[#FBFBFE]"
    >
      {/* Background: Authentic Abstract Pastel Waves and Arcs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/abstract_pastel_waves_arcs.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Top Soft Ethereal Blend */}
        <div
          className="absolute top-0 left-0 right-0 h-24 sm:h-28 md:h-32 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, #E5E5FE 0%, rgba(229,229,254,0.85) 20%, rgba(229,229,254,0.4) 60%, rgba(229,229,254,0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom Soft Dissolve into What We Do (#ffffff) */}
        <div
          className="absolute -bottom-[2px] left-0 right-0 h-16 sm:h-20 md:h-24 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0.95) 90%, #ffffff 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 lg:gap-14 xl:gap-16 my-auto py-1">
          
          {/* LEFT SIDE: Heading occupies half the screen, followed by subtext & philosophy */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            {/* Monumental Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-[54px] lg:text-[58px] xl:text-[66px] 2xl:text-[72px] font-bold tracking-tight leading-[1.08] sm:leading-[1.05] text-[#0C1A30]">
              The principles <br />
              that guide <br />
              <span className="text-[#1A56DB] italic font-medium">our work.</span>
            </h2>

            {/* Subtext below heading */}
            <p className="text-sm sm:text-xl lg:text-[22px] text-[#334155] leading-relaxed pt-3 sm:pt-6 max-w-xl">
              Four foundational commitments shape every computational architecture, clinical protocol, and user experience we create.
            </p>

            {/* Philosophy Editorial Statement (Desktop layout) */}
            <div className="hidden lg:block pt-6 sm:pt-8 space-y-3 max-w-xl border-t border-slate-200/70 mt-6 sm:mt-8">
              <h3 className="text-xl sm:text-2xl lg:text-[25px] tracking-tight leading-[1.22] text-[#0C1A30]">
                <span className="italic font-normal">Peace, harmony, simplicity,</span>{' '}
                <br className="hidden sm:inline" />
                <span className="italic font-normal">and radical </span>
                <span className="font-bold text-[#1A56DB] italic">restraint.</span>
              </h3>

              <p className="text-sm sm:text-[15px] text-[#64748B] leading-relaxed">
                True technological sophistication is quiet. We refuse attention-traps, synthetic dependency, and dopamine loops in favor of clinical rigor, privacy, and genuine human meaning.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE: 3 Cards with physical card deck shuffle animation */}
          <div
            className="w-full lg:w-1/2 flex flex-col items-start lg:items-center justify-center relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Text Navigation: Normal font typography, NO pills or background containers */}
            <div className="w-full max-w-lg flex items-center justify-start mb-5 pb-2">
              <div className="flex items-center gap-6 sm:gap-8">
                {CARDS.map((card, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleSelect(idx)}
                      className={`relative py-1 text-base sm:text-lg font-medium transition-colors duration-200 cursor-pointer bg-transparent border-0 outline-none ${
                        isActive
                          ? 'text-[#0C1A30] font-bold'
                          : 'text-[#94A3B8] hover:text-[#475569]'
                      }`}
                    >
                      {card.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeUnderline"
                          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#1A56DB] rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* The Physical Card Deck Stack */}
            <div className="relative w-full max-w-lg h-[410px] sm:h-[440px] lg:h-[460px]">
              {CARDS.map((card, idx) => {
                const position = (idx - currentIndex + CARDS.length) % CARDS.length;
                const isJustLeft = animatingCard === idx && position === CARDS.length - 1;

                // Stack depth properties
                let zIndex = 30;
                let x = 0;
                let y = 0;
                let scale = 1;
                let rotate = 0;
                let opacity = 1;
                let shadow = '0 24px 60px rgba(12, 28, 58, 0.22)';

                if (position === 0) {
                  // Front card
                  zIndex = 30;
                  x = 0;
                  y = 0;
                  scale = 1;
                  rotate = 0;
                  opacity = 1;
                  shadow = '0 24px 60px rgba(12, 28, 58, 0.22)';
                } else if (position === 1) {
                  // Second card in deck (peeking from behind)
                  zIndex = 20;
                  x = 18;
                  y = -14;
                  scale = 0.94;
                  rotate = 2.5;
                  opacity = 0.72;
                  shadow = '0 16px 40px rgba(12, 28, 58, 0.14)';
                } else {
                  // Third card in deck (deepest)
                  zIndex = 10;
                  x = 34;
                  y = -26;
                  scale = 0.88;
                  rotate = 5;
                  opacity = 0.45;
                  shadow = '0 10px 24px rgba(12, 28, 58, 0.08)';
                }

                return (
                  <motion.div
                    key={card.id}
                    style={{ zIndex }}
                    animate={
                      isJustLeft
                        ? {
                            // Smooth deck shuffle: pull out to side, dip down, glide into the back of the deck
                            x: [-12, -90, x],
                            y: [0, -18, y],
                            rotate: [0, -6, rotate],
                            scale: [1, 0.98, scale],
                            opacity: [1, 0.85, opacity],
                          }
                        : {
                            x,
                            y,
                            scale,
                            rotate,
                            opacity,
                          }
                    }
                    transition={{
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => {
                      if (position !== 0) handleSelect(idx);
                    }}
                    className={`absolute inset-0 rounded-3xl overflow-hidden cursor-pointer select-none bg-slate-900 border border-white/70 ${
                      position === 0 ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-90'
                    }`}
                  >
                    {/* Background Artwork */}
                    <img
                      src={card.image}
                      alt={card.label}
                      className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                    />

                    {/* Gradient scrim for typography legibility */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(10, 22, 45, 0.94) 0%, rgba(12, 28, 58, 0.70) 45%, rgba(15, 35, 75, 0.20) 75%, rgba(15, 35, 75, 0.06) 100%)',
                      }}
                    />

                    {/* Card Content - Pure editorial text, NO pill containers */}
                    <div className="relative z-10 w-full h-full p-5 sm:p-7 md:p-9 flex flex-col justify-end">
                      {/* Bottom typography */}
                      <div className="space-y-1.5 sm:space-y-3">
                        <h4 className="text-xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-none drop-shadow-md">
                          {card.label}
                        </h4>

                        <p className="text-sm sm:text-lg lg:text-[19px] font-medium text-white/95 leading-snug drop-shadow-sm">
                          {card.tagline}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed pt-0.5 sm:pt-1 max-w-md drop-shadow-sm line-clamp-3 sm:line-clamp-none">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Philosophy Editorial Statement (Mobile layout placed right under the card deck) */}
            <div className="lg:hidden w-full pt-3.5 space-y-1 border-t border-slate-200/60 mt-4">
              <h3 className="text-sm sm:text-base font-bold tracking-tight text-[#0C1A30]">
                Peace, harmony, simplicity, <span className="text-[#1A56DB] italic font-medium">and radical restraint.</span>
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                True technological sophistication is quiet. We refuse attention-traps in favor of clinical rigor, privacy, and genuine human meaning.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
