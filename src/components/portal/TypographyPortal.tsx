import React, { useState, useEffect } from 'react';

interface TypographyPortalProps {
  onEnter: () => void;
  isCompleted: boolean;
  onStartTransition?: () => void;
  onFadeInContent?: () => void;
}

export const TypographyPortal: React.FC<TypographyPortalProps> = ({
  onEnter,
  isCompleted,
  onStartTransition,
  onFadeInContent,
}) => {
  const [isTextFading, setIsTextFading] = useState(false);
  const [isPortalFading, setIsPortalFading] = useState(false);

  // Trigger swift, smooth fade transition into the hero section
  const startTransition = () => {
    if (isTextFading || isCompleted) return;

    // Step 1: Start fading out the 'affynelabs' typography quickly and smoothly (~400ms)
    setIsTextFading(true);
    if (onStartTransition) {
      onStartTransition();
    }

    // Step 2: Trigger hero content & navigation to fade in promptly without a long delay (~450ms)
    setTimeout(() => {
      if (onFadeInContent) {
        onFadeInContent();
      }
      setIsPortalFading(true);
    }, 450);

    // Step 3: Complete transition & unlock page scroll (~750ms)
    setTimeout(() => {
      onEnter();
    }, 750);
  };

  // Listen for click, wheel scroll, touch gestures, or keyboard events
  useEffect(() => {
    if (isCompleted || isTextFading) return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 3) {
        startTransition();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      if (Math.abs(touchStartY - currentY) > 8) {
        startTransition();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') {
        startTransition();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCompleted, isTextFading]);

  if (isCompleted) return null;

  return (
    <div
      onClick={startTransition}
      className={`fixed inset-0 z-50 overflow-hidden cursor-pointer select-none transition-opacity duration-400 ease-out ${
        isPortalFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="button"
      tabIndex={0}
      aria-label="Enter affynelabs"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') startTransition();
      }}
    >
      {/* 
        Layer 1: Environmental Backdrop (Sky, Clouds & Misty Mountains)
        Zoomed in on mobile and tablet for dramatic, cinematic framing
      */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/Serene_Meadow_Above_Misty_Mountains.png"
          alt="Serene meadow above misty mountains"
          className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_bottom] scale-[1.20] sm:scale-[1.14] md:scale-100 origin-[50%_80%] md:origin-bottom -translate-y-4 sm:-translate-y-5 md:translate-y-0 transition-transform duration-700 ease-out"
          loading="eager"
        />

        <div
          className="absolute inset-0 bg-gradient-to-b from-black/[0.04] via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 
        Layer 2: Monumental Brand Typography positioned in 3D midground behind the character
        Lifted slightly upside on desktop with precise horizontal centering, so the figure overlaps the lower letters naturally
      */}
      <div className="absolute left-0 right-0 z-10 flex flex-col items-center pointer-events-none top-[48%] sm:top-[51%] md:top-[50%] lg:top-[51%] -translate-y-1/2 px-4">
        <div
          className={`flex flex-col items-center justify-center text-center transition-all duration-400 ease-out w-full max-w-7xl mx-auto ${
            isTextFading ? 'opacity-0 scale-98 translate-y-3' : 'opacity-100 scale-100 translate-y-0'
          }`}
        >
          <span className="text-[17vw] sm:text-[15vw] md:text-[13vw] lg:text-[11.5vw] xl:text-[160px] 2xl:text-[185px] font-black tracking-[-0.04em] leading-none text-white drop-shadow-[0_4px_32px_rgba(10,30,60,0.2)] select-none text-center">
            affynelabs
          </span>
        </div>
      </div>

      {/* 
        Layer 3: Foreground Character Cutout & Meadow Grass
        Matches Layer 1 scale and origin identically so the character sits perfectly on top of the text
      */}
      <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
        <img
          src="/assets/Serene_Meadow_Foreground_Character.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_bottom] scale-[1.20] sm:scale-[1.14] md:scale-100 origin-[50%_80%] md:origin-bottom -translate-y-4 sm:-translate-y-5 md:translate-y-0 transition-transform duration-700 ease-out select-none"
        />
      </div>
    </div>
  );
};
