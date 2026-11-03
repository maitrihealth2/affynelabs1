import React from 'react';

export const WhoWeAreSection: React.FC = () => {
  return (
    <section
      id="who-we-are"
      className="relative w-full min-h-screen md:h-screen md:max-h-screen px-6 sm:px-12 lg:px-20 py-10 lg:py-14 flex flex-col justify-between snap-start overflow-hidden select-none bg-[#FBFBFE]"
    >
      {/* Background: Authentic Pastel Lavender Wave Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/pastel_lavender_wave_gradient.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Top Soft Morning Mist Blend: Dissolves seamlessly from Hero into the pastel canvas */}
        <div
          className="absolute top-0 left-0 right-0 h-36 sm:h-48 md:h-60 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.85) 25%, rgba(255,255,255,0.45) 55%, rgba(255,255,255,0.1) 80%, rgba(255,255,255,0) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Bottom Soft Ethereal Blend: Bridges seamlessly into Foundation */}
        <div
          className="absolute -bottom-[2px] left-0 right-0 h-28 sm:h-36 md:h-44 pointer-events-none z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(229,229,254,0) 0%, rgba(229,229,254,0.3) 35%, rgba(229,229,254,0.75) 75%, rgba(229,229,254,0.95) 90%, #E5E5FE 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between">
        {/* Top Spacer */}
        <div className="pt-1" />

        {/* Section Header: Two-column asymmetrical display with vertical metallic divider */}
        <div className="my-auto pt-2 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-14 pb-8 lg:pb-12 border-b border-slate-200/50">
            {/* Left Column: Monumental Headline */}
            <div className="lg:max-w-2xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-bold tracking-tight leading-[1.08] text-[#0C1A30]">
                We build <br className="hidden sm:inline" />
                technology that <br />
                <span className="text-[#1A56DB] italic font-medium">listens</span> before <br className="hidden sm:inline" />
                it speaks.
              </h2>
            </div>

            {/* Vertical Metallic Divider */}
            <div
              className="hidden lg:block w-[1px] h-32 self-center shrink-0 origin-center"
              style={{
                background:
                  'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.5) 20%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.5) 80%, rgba(200,215,235,0) 100%)',
                boxShadow: '0 0 6px rgba(180, 205, 235, 0.45)',
              }}
              aria-hidden="true"
            />

            {/* Right Column: Mission Statement Lead */}
            <div className="lg:max-w-md">
              <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
                At Affyne Labs, our purpose is to bridge the chasm between human vulnerability and modern technology. We measure our achievement by the depth of human dignity preserved.
              </p>
            </div>
          </div>

          {/* 3 Columns: Identity, Integrity & Responsibility with Metallic Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 pt-8 lg:pt-10">
            {/* Column 1: Identity */}
            <div className="md:pr-8 lg:pr-12 space-y-2">
              <h3 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold tracking-tight text-[#0C1A30]">
                Identity
              </h3>
              <p className="text-sm sm:text-base font-medium text-[#475569]">
                Engineers and Humanists
              </p>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1">
                Based in Bengaluru, India, affynelabs develops privacy-first, AI-driven solutions for healthcare, with dedicated focus on mental health and emotional well-being.
              </p>
            </div>

            {/* Column 2: Integrity (with metallic border on left) */}
            <div
              className="md:px-8 lg:px-12 space-y-2 md:border-l border-slate-200/60"
              style={{
                borderImage:
                  'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.6) 25%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.6) 75%, rgba(200,215,235,0) 100%) 1',
              }}
            >
              <h3 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold tracking-tight text-[#0C1A30]">
                Integrity
              </h3>
              <p className="text-sm sm:text-base font-medium text-[#475569]">
                Dignity Over Metrics
              </p>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1">
                We reject digital noise, behavioral addiction loops, and data harvesting. We believe healthcare technology should feel calm, trustworthy, and respectful.
              </p>
            </div>

            {/* Column 3: Responsibility (with metallic border on left) */}
            <div
              className="md:pl-8 lg:pl-12 space-y-2 md:border-l border-slate-200/60"
              style={{
                borderImage:
                  'linear-gradient(180deg, rgba(200,215,235,0) 0%, rgba(148,163,184,0.6) 25%, rgba(226,232,240,0.95) 50%, rgba(148,163,184,0.6) 75%, rgba(200,215,235,0) 100%) 1',
              }}
            >
              <h3 className="text-2xl sm:text-[28px] lg:text-[30px] font-bold tracking-tight text-[#0C1A30]">
                Responsibility
              </h3>
              <p className="text-sm sm:text-base font-medium text-[#475569]">
                Safety by Design
              </p>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1">
                We engineer computational systems where privacy is mathematically guaranteed rather than an optional toggle, serving patients and clinicians with unconditional safety.
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
