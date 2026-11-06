import React from 'react';
import { motion } from 'motion/react';

export const WhoWeAreSection: React.FC = () => {
  return (
    <section
      id="who-we-are"
      className="relative w-full min-h-0 sm:min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 py-14 sm:py-24 lg:py-18 xl:py-20 flex flex-col justify-center overflow-hidden select-none bg-[#FBFBFE]"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto space-y-6 sm:space-y-10 lg:space-y-12">
        
        {/* Top Two-Column Grid: Staggered Header & Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left Column: Monumental Headline */}
          <div className="min-w-0">
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.75rem,5.6vw,3.25rem)] font-bold tracking-tight leading-[1.15] sm:leading-[1.12] text-[#0C1A30]"
            >
              <span>We build technology that </span>
              <span className="text-[#1A56DB] italic font-medium">listens</span> before it speaks.
            </motion.h2>
          </div>

          {/* Right Column: Narrative Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:pl-8 min-w-0"
          >
            <p className="text-sm sm:text-xl lg:text-[21px] xl:text-[23px] text-[#334155] leading-relaxed sm:leading-[1.6] tracking-[-0.01em]">
              At Affyne Labs, our purpose is to bridge the chasm between human vulnerability and modern technology. We measure our achievement by the depth of human dignity preserved.
            </p>
          </motion.div>
        </div>

        {/* 3 Columns: Identity, Integrity & Responsibility — Open Editorial Columns (No Container Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-4 sm:pt-6 border-t border-slate-200/50">
          
          {/* Column 1: Identity */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 min-w-0"
          >
            <div className="flex items-baseline justify-between sm:block gap-2 flex-wrap sm:flex-nowrap">
              <h3 className="text-xl sm:text-[24px] lg:text-[26px] font-bold tracking-tight text-[#0C1A30]">
                Identity
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#1A56DB] sm:pt-1">
                Engineers &amp; Humanists
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pt-1">
              Based in Bengaluru, India, affynelabs develops privacy-first, AI-driven solutions for healthcare, with dedicated focus on mental health and emotional well-being.
            </p>
          </motion.div>

          {/* Column 2: Integrity */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 min-w-0"
          >
            <div className="flex items-baseline justify-between sm:block gap-2 flex-wrap sm:flex-nowrap">
              <h3 className="text-xl sm:text-[24px] lg:text-[26px] font-bold tracking-tight text-[#0C1A30]">
                Integrity
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#1A56DB] sm:pt-1">
                Dignity Over Metrics
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pt-1">
              We reject digital noise, behavioral addiction loops, and data harvesting. We believe healthcare technology should feel calm, trustworthy, and respectful.
            </p>
          </motion.div>

          {/* Column 3: Responsibility */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2 min-w-0"
          >
            <div className="flex items-baseline justify-between sm:block gap-2 flex-wrap sm:flex-nowrap">
              <h3 className="text-xl sm:text-[24px] lg:text-[26px] font-bold tracking-tight text-[#0C1A30]">
                Responsibility
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-[#1A56DB] sm:pt-1">
                Safety by Design
              </p>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pt-1">
              We engineer computational systems where privacy is mathematically guaranteed rather than an optional toggle, serving patients and clinicians with unconditional safety.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
