import React, { useState } from 'react';
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
  const [selectedId, setSelectedId] = useState<string>(ACTIVITIES[0].id);
  const activeActivity = ACTIVITIES.find((a) => a.id === selectedId) || ACTIVITIES[0];

  return (
    <section
      id="what-we-do"
      className="relative w-full h-screen min-h-[620px] max-h-screen px-6 sm:px-12 lg:px-20 py-10 lg:py-14 bg-white flex flex-col justify-between snap-start overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between">
        {/* Section Header */}
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-bold tracking-tight leading-[1.08] text-[#0C1A30] mb-3">
            Engineering technology that respects <span className="text-[#1D4E89] italic">human fragility</span>.
          </h2>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
            Five core engineering disciplines developed with clinical rigor to protect patient sovereignty and deliver meaningful care.
          </p>
        </div>

        {/* Central Arrangement: Vertical Disciplines Navigation on Left, Content on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto pt-2">
          {/* Left: Pure Typography Vertical Navigation */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            {ACTIVITIES.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className="w-full text-left py-1 transition-all cursor-pointer block"
                >
                  <h3
                    className={`text-2xl sm:text-3xl lg:text-[32px] xl:text-[35px] font-bold tracking-tight transition-colors duration-200 leading-tight whitespace-nowrap ${
                      isSelected
                        ? 'text-[#0C1A30]'
                        : 'text-[#94A3B8] hover:text-[#0C1A30]'
                    }`}
                  >
                    {item.title}
                  </h3>
                </button>
              );
            })}
          </div>

          {/* Right: Active Activity Presentation */}
          <div className="lg:col-span-6 lg:pl-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeActivity.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="space-y-4 max-w-2xl"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4E89] block">
                  {activeActivity.category}
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[38px] font-bold tracking-tight leading-[1.15] bg-gradient-to-r from-[#0C1A30] via-[#1B3A64] to-[#2E5B94] bg-clip-text text-transparent">
                  {activeActivity.statement}
                </h3>
                <p className="text-base sm:text-lg text-[#475569] leading-relaxed pt-1">
                  {activeActivity.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Quiet Bottom Footprint Placeholder */}
        <div className="pt-3" />
      </div>
    </section>
  );
};
