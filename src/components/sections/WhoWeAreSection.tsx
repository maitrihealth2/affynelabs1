import React from 'react';

export const WhoWeAreSection: React.FC = () => {
  return (
    <section
      id="who-we-are"
      style={{ scrollSnapAlign: 'center' }}
      className="relative w-full min-h-screen lg:h-screen lg:max-h-screen px-6 sm:px-12 lg:px-20 pt-24 sm:pt-28 lg:pt-28 pb-10 sm:pb-16 lg:pb-20 flex flex-col justify-between overflow-hidden select-none bg-[#FBFBFE]"
    >
      {/* Background: Soft Ethereal Blue Wave Artwork */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/whoweare_bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Top: subtle ambient transition from hero */}
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(251,251,254,0.6) 0%, rgba(251,251,254,0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom Soft Dissolve: Bridges cleanly into Foundation */}
        <div
          className="absolute -bottom-[2px] left-0 right-0 h-24 sm:h-32 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.7) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Section Header: Balanced two-column grid where text fills the upper half without feeling stretched */}
        <div className="w-full my-auto space-y-6 sm:space-y-8 lg:space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 xl:gap-16 items-center pb-6 sm:pb-8 lg:pb-10 border-b border-slate-200/60">
            {/* Left Column: Headline filling its half with balanced lines */}
            <div>
              <h2 className="text-[28px] sm:text-4xl md:text-[42px] lg:text-[45px] xl:text-[48px] 2xl:text-[52px] font-bold tracking-tight leading-[1.15] sm:leading-[1.12] text-[#0C1A30]">
                <span className="block sm:whitespace-nowrap">We build technology that</span>
                <span className="block sm:whitespace-nowrap">
                  <span className="text-[#1A56DB] italic font-medium">listens</span> before it speaks.
                </span>
              </h2>
            </div>

            {/* Right Column: Meaning Text pulled beside it, filling its half with metallic border */}
            <div className="lg:border-l border-slate-200/70 lg:pl-10 xl:pl-14">
              <p className="text-sm sm:text-xl lg:text-[21px] xl:text-[23px] text-[#334155] leading-relaxed sm:leading-[1.6] tracking-[-0.01em]">
                At Affyne Labs, our purpose is to bridge the chasm between human vulnerability and modern technology. We measure our achievement by the depth of human dignity preserved.
              </p>
            </div>
          </div>

          {/* 3 Columns: Identity, Integrity & Responsibility with Metallic Dividers on desktop, elegant paired rows on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6 md:gap-0 pt-1 sm:pt-2 lg:pt-4">
            {/* Column 1: Identity */}
            <div className="md:pr-8 lg:pr-12 space-y-1 sm:space-y-2 pb-3 md:pb-0 border-b md:border-b-0 border-slate-200/50">
              <div className="flex items-baseline justify-between sm:block">
                <h3 className="text-xl sm:text-[28px] lg:text-[30px] font-bold tracking-tight text-[#0C1A30]">
                  Identity
                </h3>
                <p className="text-xs sm:text-base font-medium text-[#475569] sm:pt-1">
                  Engineers and Humanists
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Based in Bengaluru, India, affynelabs develops privacy-first, AI-driven solutions for healthcare, with dedicated focus on mental health and emotional well-being.
              </p>
            </div>

            {/* Column 2: Integrity (with metallic border on left for desktop) */}
            <div
              className="md:px-8 lg:px-12 space-y-1 sm:space-y-2 pb-3 md:pb-0 border-b md:border-b-0 border-slate-200/50 md:border-l border-slate-200/60"
              style={{
                borderImage:
                  'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.6) 25%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.6) 75%, rgba(200,215,235,0) 100%) 1',
              }}
            >
              <div className="flex items-baseline justify-between sm:block">
                <h3 className="text-xl sm:text-[28px] lg:text-[30px] font-bold tracking-tight text-[#0C1A30]">
                  Integrity
                </h3>
                <p className="text-xs sm:text-base font-medium text-[#475569] sm:pt-1">
                  Dignity Over Metrics
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We reject digital noise, behavioral addiction loops, and data harvesting. We believe healthcare technology should feel calm, trustworthy, and respectful.
              </p>
            </div>

            {/* Column 3: Responsibility (with metallic border on left for desktop) */}
            <div
              className="md:pl-8 lg:pl-12 space-y-1 sm:space-y-2 pb-1 md:pb-0 md:border-l border-slate-200/60"
              style={{
                borderImage:
                  'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.6) 25%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.6) 75%, rgba(200,215,235,0) 100%) 1',
              }}
            >
              <div className="flex items-baseline justify-between sm:block">
                <h3 className="text-xl sm:text-[28px] lg:text-[30px] font-bold tracking-tight text-[#0C1A30]">
                  Responsibility
                </h3>
                <p className="text-xs sm:text-base font-medium text-[#475569] sm:pt-1">
                  Safety by Design
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                We engineer computational systems where privacy is mathematically guaranteed rather than an optional toggle, serving patients and clinicians with unconditional safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
