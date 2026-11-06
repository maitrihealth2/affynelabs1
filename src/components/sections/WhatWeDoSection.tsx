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
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-switch every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ACTIVITIES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeActivity = ACTIVITIES[activeIndex];

  return (
    <section
      id="what-we-do"
      className="relative w-full min-h-0 sm:min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-14 sm:py-24 lg:py-18 xl:py-20 bg-white flex flex-col justify-center select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full my-auto space-y-6 sm:space-y-10 lg:space-y-10">
        
        {/* Section Header with Staggered Entrance */}
        <div className="max-w-3xl space-y-2.5 sm:space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(1.75rem,5.5vw,3.35rem)] font-bold tracking-tight leading-[1.12] sm:leading-[1.08] text-[#0C1A30]"
          >
            Engineering technology that respects{' '}
            <span className="text-[#1D4E89] italic">human fragility</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl"
          >
            Five core engineering disciplines developed with clinical rigor to protect patient sovereignty and deliver meaningful care.
          </motion.p>
        </div>

        {/* Central Arrangement: Rotating Topic Wheel (Mobile & Desktop) + Content Details on Right */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-14 items-stretch lg:items-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Rotating topic wheel — animated identically on mobile & desktop */}
          <div className="lg:col-span-6 relative flex flex-col justify-center">
            <div className="relative h-[190px] sm:h-[260px] lg:h-[380px] w-full flex items-center overflow-hidden lg:overflow-visible">
              {/* Ambient arc track */}
              <svg
                className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-36 sm:w-48 h-full pointer-events-none -z-0 opacity-40"
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

                  // Mobile vs Desktop coordinates
                  let y = 0, x = 0, scale = 1, opacity = 1;
                  if (isMobile) {
                    if (signedOffset === 0) { y = 0; x = 16; scale = 1.05; opacity = 1; }
                    else if (signedOffset === 1) { y = 46; x = 6; scale = 0.90; opacity = 0.55; }
                    else if (signedOffset === 2) { y = 88; x = -4; scale = 0.80; opacity = 0.2; }
                    else if (signedOffset === -1) { y = -46; x = 6; scale = 0.90; opacity = 0.55; }
                    else if (signedOffset === -2) { y = -88; x = -4; scale = 0.80; opacity = 0.2; }
                  } else {
                    if (signedOffset === 0) { y = 0; x = 32; scale = 1.05; opacity = 1; }
                    else if (signedOffset === 1) { y = 72; x = 12; scale = 0.94; opacity = 0.65; }
                    else if (signedOffset === 2) { y = 138; x = -16; scale = 0.86; opacity = 0.38; }
                    else if (signedOffset === -1) { y = -72; x = 12; scale = 0.94; opacity = 0.65; }
                    else if (signedOffset === -2) { y = -138; x = -16; scale = 0.86; opacity = 0.38; }
                  }

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveIndex(idx)}
                      animate={{ y, x, scale, opacity }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ position: 'absolute', top: '50%', transformOrigin: 'left center' }}
                      className="max-w-[calc(100%-20px)] text-left py-1 sm:py-2 cursor-pointer block select-none -translate-y-1/2 focus:outline-none"
                    >
                      <h3
                        className={`font-bold tracking-tight transition-all duration-300 leading-tight ${
                          isActive
                            ? 'text-lg sm:text-2xl lg:text-[32px] xl:text-[34px] text-[#0C1A30]'
                            : 'text-sm sm:text-lg lg:text-[24px] xl:text-[26px] text-[#94A3B8] hover:text-[#475569]'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Active detail statement (Open Editorial, No Container Box) */}
          <div className="lg:col-span-6 lg:pl-10 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeActivity.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3 sm:space-y-4 max-w-xl min-w-0"
              >
                {/* Statement Headline */}
                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight leading-[1.18] sm:leading-[1.16] text-[#0C1A30]">
                  {activeActivity.statement}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm lg:text-base text-[#475569] leading-relaxed">
                  {activeActivity.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
