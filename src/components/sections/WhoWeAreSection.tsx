import React from 'react';

export const WhoWeAreSection: React.FC = () => {
  return (
    <section
      id="who-we-are"
      className="relative w-full min-h-screen lg:h-screen lg:max-h-screen px-6 sm:px-12 lg:px-20 pt-24 sm:pt-28 lg:pt-28 pb-10 sm:pb-16 lg:pb-20 flex flex-col justify-between overflow-hidden select-none bg-[#FBFBFE]"
    >
      {/* Background: Soft Ethereal Dreamy Artwork with Subtle Warmth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/whoweare_bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Top subtle blend — seamlessly transitions from Hero background */}
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, #F7F8FA 0%, rgba(247,248,250,0) 100%)' }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Section Header: Seamless two-column grid without artificial horizontal dividing lines */}
        <div className="w-full my-auto space-y-8 sm:space-y-10 lg:space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-14 xl:gap-20 items-center">
            {/* Left Column: Headline */}
            <div>
              <h2 className="text-[28px] sm:text-4xl md:text-[42px] lg:text-[45px] xl:text-[48px] 2xl:text-[52px] font-bold tracking-tight leading-[1.15] sm:leading-[1.12] text-[#0C1A30]">
                <span className="block sm:whitespace-nowrap">We build technology that</span>
                <span className="block sm:whitespace-nowrap">
                  <span className="text-[#1A56DB] italic font-medium">listens</span> before it speaks.
                </span>
              </h2>
            </div>

            {/* Right Column: Narrative Statement */}
            <div className="lg:pl-8">
              <p className="text-sm sm:text-xl lg:text-[21px] xl:text-[23px] text-[#334155] leading-relaxed sm:leading-[1.6] tracking-[-0.01em]">
                At Affyne Labs, our purpose is to bridge the chasm between human vulnerability and modern technology. We measure our achievement by the depth of human dignity preserved.
              </p>
            </div>
          </div>

          {/* 3 Columns: Identity, Integrity & Responsibility — unified cards with subtle hover warmth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-2 lg:pt-4">
            {/* Column 1: Identity */}
            <div className="space-y-1.5 sm:space-y-2.5">
              <div className="flex items-baseline justify-between sm:block">
                <h3 className="text-xl sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-[#0C1A30]">
                  Identity
                </h3>
                <p className="text-xs sm:text-base font-medium text-[#1A56DB] sm:pt-1">
                  Engineers and Humanists
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Based in Bengaluru, India, affynelabs develops privacy-first, AI-driven solutions for healthcare, with dedicated focus on mental health and emotional well-being.
              </p>
            </div>

            {/* Column 2: Integrity */}
            <div className="space-y-1.5 sm:space-y-2.5">
              <div className="flex items-baseline justify-between sm:block">
                <h3 className="text-xl sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-[#0C1A30]">
                  Integrity
                </h3>
                <p className="text-xs sm:text-base font-medium text-[#1A56DB] sm:pt-1">
                  Dignity Over Metrics
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                We reject digital noise, behavioral addiction loops, and data harvesting. We believe healthcare technology should feel calm, trustworthy, and respectful.
              </p>
            </div>

            {/* Column 3: Responsibility */}
            <div className="space-y-1.5 sm:space-y-2.5">
              <div className="flex items-baseline justify-between sm:block">
                <h3 className="text-xl sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-[#0C1A30]">
                  Responsibility
                </h3>
                <p className="text-xs sm:text-base font-medium text-[#1A56DB] sm:pt-1">
                  Safety by Design
                </p>
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                We engineer computational systems where privacy is mathematically guaranteed rather than an optional toggle, serving patients and clinicians with unconditional safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
