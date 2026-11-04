import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ActivityItem {
  id: string;
  category: string;
  title: string;
  statement: string;
  description: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'human-centered',
    category: 'Human Agency First',
    title: 'Human-Centered Technology',
    statement: 'Interfaces attuned to vulnerability, pacing, and emotional clarity.',
    description:
      'We design interaction systems attuned to real human vulnerability, pacing experiences to reduce cognitive overload and support genuine emotional clarity.',
  },
  {
    id: 'privacy-first',
    category: 'Data Sovereignty First',
    title: 'Privacy-First Healthcare',
    statement: 'Zero-egress computation ensuring reflections remain strictly sovereign.',
    description:
      'Zero-egress computational enclaves and client-side cryptographic storage ensure intimate mental health reflections never leave user-controlled boundaries.',
  },
  {
    id: 'responsible-ai',
    category: 'Clinical Safety First',
    title: 'Responsible AI Applications',
    statement: 'Deterministic neural boundaries engineered to prevent synthetic dependency.',
    description:
      'Safety-first neural architectures engineered strictly to prevent synthetic dependency, reject medical diagnosis fabrication, and respect clinical ethics.',
  },
  {
    id: 'accessible-safety',
    category: 'Universal Access First',
    title: 'Accessible & Safe Experiences',
    statement: 'Calming, universal interfaces with empathetic crisis interception.',
    description:
      'Calming, non-sensory-overloading interfaces engineered for all cognitive profiles, featuring compassionate crisis recognition and verified routing to human care.',
  },
  {
    id: 'clinical-validation',
    category: 'Evidentiary Validation First',
    title: 'Clinical Research & Validation',
    statement: 'Empirical scientific discipline conducted with licensed practitioners.',
    description:
      'Continuous collaborative studies with licensed psychologists, psychiatrists, and research institutions to empirically validate safety and efficacy before deployment.',
  },
];

export const WhatWeDoSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-switch in a continuous loop every 3 seconds
  // Topics come DOWN from the left side in a semi-circle format.
  // When a topic finishes, it moves down below the line and the next topic comes down into place.
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeActivity = ACTIVITIES[activeIndex];

  return (
    <section
      id="what-we-do"
      className="relative w-full min-h-screen px-6 sm:px-12 lg:px-20 pt-24 sm:pt-28 lg:py-14 pb-12 bg-white flex flex-col justify-center overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center my-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-1 sm:mb-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-bold tracking-tight leading-[1.12] sm:leading-[1.08] text-[#0C1A30] mb-2 sm:mb-3">
            Engineering technology that respects{' '}
            <span className="text-[#1D4E89] italic">human fragility</span>.
          </h2>
          <p className="text-xs sm:text-base text-[#475569] leading-relaxed max-w-2xl">
            Five core engineering disciplines developed with clinical rigor to protect patient sovereignty and deliver meaningful care.
          </p>
        </div>

        {/* Central Arrangement: Semi-Circle Rotating Topics on Left, Content Details on Right */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-14 items-center my-auto py-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* LEFT: Semi-Circle Rotating Carousel moving downwards */}
          <div className="lg:col-span-6 relative h-[180px] sm:h-[240px] lg:h-[400px] flex items-center overflow-visible">
            {/* Ambient Semi-Circle Track SVG */}
            <svg
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-48 h-full pointer-events-none -z-0 opacity-40"
              viewBox="0 0 100 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 5 20 Q 70 190 5 360"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            </svg>

            <div className="relative w-full h-full flex items-center">
              {ACTIVITIES.map((item, idx) => {
                let signedOffset = activeIndex - idx;
                if (signedOffset > 2) signedOffset -= ACTIVITIES.length;
                if (signedOffset < -2) signedOffset += ACTIVITIES.length;

                const isActive = signedOffset === 0;

                // Responsive semi-circle coordinates
                let y = 0;
                let x = 0;
                let scale = 1;
                let opacity = 1;

                if (isMobile) {
                  // Compact coordinates for mobile screen so both wheel & details fit comfortably
                  if (signedOffset === 0) {
                    y = 0;
                    x = 16;
                    scale = 1.05;
                    opacity = 1;
                  } else if (signedOffset === 1) {
                    y = 44;
                    x = 6;
                    scale = 0.90;
                    opacity = 0.55;
                  } else if (signedOffset === 2) {
                    y = 86;
                    x = -8;
                    scale = 0.80;
                    opacity = 0.2;
                  } else if (signedOffset === -1) {
                    y = -44;
                    x = 6;
                    scale = 0.90;
                    opacity = 0.55;
                  } else if (signedOffset === -2) {
                    y = -86;
                    x = -8;
                    scale = 0.80;
                    opacity = 0.2;
                  }
                } else {
                  // Full coordinates for desktop
                  if (signedOffset === 0) {
                    y = 0;
                    x = 32;
                    scale = 1.06;
                    opacity = 1;
                  } else if (signedOffset === 1) {
                    y = 74;
                    x = 12;
                    scale = 0.94;
                    opacity = 0.65;
                  } else if (signedOffset === 2) {
                    y = 142;
                    x = -16;
                    scale = 0.86;
                    opacity = 0.38;
                  } else if (signedOffset === -1) {
                    y = -74;
                    x = 12;
                    scale = 0.94;
                    opacity = 0.65;
                  } else if (signedOffset === -2) {
                    y = -142;
                    x = -16;
                    scale = 0.86;
                    opacity = 0.38;
                  }
                }

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    animate={{
                      y,
                      x,
                      scale,
                      opacity,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transformOrigin: 'left center',
                    }}
                    className="w-full text-left py-1 sm:py-2 transition-colors duration-200 cursor-pointer block select-none group -translate-y-1/2 focus:outline-none"
                    aria-label={`Select ${item.title}`}
                  >
                    <div className="flex items-center">
                      <h3
                        className={`font-bold tracking-tight transition-all duration-300 leading-tight ${
                          isActive
                            ? 'text-xl sm:text-3xl lg:text-[34px] xl:text-[36px] text-[#0C1A30]'
                            : 'text-sm sm:text-xl lg:text-[25px] xl:text-[27px] text-[#64748B] group-hover:text-[#0C1A30]'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Active Activity Presentation & Details */}
          <div className="lg:col-span-6 lg:pl-8 lg:border-l border-slate-200/70 pt-2 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeActivity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2 sm:space-y-4 max-w-xl"
              >
                {/* Statement Headline */}
                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-[36px] font-bold tracking-tight leading-[1.18] sm:leading-[1.16] text-[#0C1A30]">
                  {activeActivity.statement}
                </h3>

                {/* Description Text */}
                <p className="text-xs sm:text-base lg:text-lg text-[#475569] leading-relaxed pt-0.5 sm:pt-1">
                  {activeActivity.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
