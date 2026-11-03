import React from 'react';

export const FoundationSection: React.FC = () => {
  return (
    <section
      id="foundation"
      className="relative w-full min-h-screen md:h-screen md:max-h-screen px-6 sm:px-12 lg:px-20 py-10 lg:py-14 flex flex-col justify-between snap-start overflow-hidden select-none bg-[#FBFBFE]"
    >
      {/* Background: Authentic Abstract Pastel Waves and Arcs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/abstract_pastel_waves_arcs.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Top Soft Ethereal Blend: Seamless bridge receiving from Who We Are */}
        <div
          className="absolute top-0 left-0 right-0 h-28 sm:h-36 md:h-44 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, #E5E5FE 0%, rgba(229,229,254,0.85) 20%, rgba(229,229,254,0.4) 60%, rgba(229,229,254,0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom Soft Dissolve into What We Do (#ffffff) */}
        <div
          className="absolute -bottom-[2px] left-0 right-0 h-32 sm:h-44 md:h-52 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0.95) 90%, #ffffff 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between">
        {/* Top Spacer */}
        <div className="pt-1" />

        <div className="my-auto space-y-6 lg:space-y-8">
          {/* Section Header: Two-column asymmetrical display with vertical metallic divider */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-14 pb-6 border-b border-slate-200/50">
            {/* Left Column: Headline */}
            <div className="lg:max-w-xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-bold tracking-tight leading-[1.08] text-[#0C1A30]">
                The principles <br className="hidden sm:inline" />
                that guide <br />
                <span className="text-[#1A56DB] italic font-medium">our work.</span>
              </h2>
            </div>

            {/* Vertical Metallic Divider */}
            <div
              className="hidden lg:block w-[1px] h-28 self-center shrink-0 origin-center"
              style={{
                background:
                  'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.5) 20%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.5) 80%, rgba(200,215,235,0) 100%)',
                boxShadow: '0 0 6px rgba(180, 205, 235, 0.45)',
              }}
              aria-hidden="true"
            />

            {/* Right Column: Lead Narrative */}
            <div className="lg:max-w-md">
              <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
                Four foundational commitments shape every computational architecture, clinical protocol, and user experience we create.
              </p>
            </div>
          </div>

          {/* Central Heroic Philosophy: Expressive Editorial Focal Point */}
          <div className="text-center max-w-4xl mx-auto py-2 sm:py-4">
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] tracking-tight leading-[1.18] text-[#0C1A30]">
              <span className="italic font-normal">Peace, harmony, simplicity,</span>{' '}
              <br className="hidden sm:inline" />
              <span className="italic font-normal">and radical </span>
              <span className="font-bold text-[#1A56DB] italic">restraint.</span>
            </h3>

            {/* Metallic Horizontal Hairline Divider */}
            <div
              className="w-44 sm:w-56 h-[1.5px] mx-auto my-4 rounded-full origin-center"
              style={{
                background:
                  'linear-gradient(90deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.6) 20%, rgba(226,232,240,1) 50%, rgba(148,163,184,0.6) 80%, rgba(200,215,235,0) 100%)',
                boxShadow: '0 0 8px rgba(180, 205, 235, 0.5)',
              }}
              aria-hidden="true"
            />

            <p className="text-xs sm:text-sm md:text-base text-[#475569] leading-relaxed max-w-2xl mx-auto">
              True technological sophistication is quiet. We refuse attention-traps, synthetic dependency, and dopamine loops in favor of clinical rigor, privacy, and genuine human meaning.
            </p>
          </div>

          {/* Bottom Row: Purpose, Vision & Mission with Slanted Metallic Slash Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-0 items-center pt-2">
            {/* Purpose */}
            <div className="md:col-span-1 space-y-1.5 md:pr-4">
              <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[#0C1A30]">
                Purpose
              </h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Bridging human vulnerability with thoughtful, accessible technology.
              </p>
            </div>

            {/* Slanted Metallic Divider 1 */}
            <div className="hidden md:flex justify-center items-center">
              <div
                className="w-[1.5px] h-12 transform rotate-[25deg]"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.6) 25%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.6) 75%, rgba(200,215,235,0) 100%)',
                  boxShadow: '0 0 6px rgba(180, 205, 235, 0.45)',
                }}
                aria-hidden="true"
              />
            </div>

            {/* Vision */}
            <div className="md:col-span-1 space-y-1.5 md:px-4">
              <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[#0C1A30]">
                Vision
              </h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Empathy, clarity, and trust.
              </p>
            </div>

            {/* Slanted Metallic Divider 2 */}
            <div className="hidden md:flex justify-center items-center">
              <div
                className="w-[1.5px] h-12 transform rotate-[25deg]"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.6) 25%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.6) 75%, rgba(200,215,235,0) 100%)',
                  boxShadow: '0 0 6px rgba(180, 205, 235, 0.45)',
                }}
                aria-hidden="true"
              />
            </div>

            {/* Mission */}
            <div className="md:col-span-1 space-y-1.5 md:pl-4">
              <h4 className="text-lg sm:text-xl font-bold tracking-tight text-[#0C1A30]">
                Mission
              </h4>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Developing provably safe, privacy-first clinical technologies.
              </p>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Footprint Placeholder */}
        <div className="pt-2" />
      </div>
    </section>
  );
};
