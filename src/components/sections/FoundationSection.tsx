import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Eye, Shield } from 'lucide-react';

interface FoundationPillar {
  id: string;
  label: string;
  statement: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  accentColor: string;
  glowColor: string;
}

const PILLARS: FoundationPillar[] = [
  {
    id: 'purpose',
    label: 'Purpose',
    statement: 'Bridging human vulnerability with thoughtful, accessible technology.',
    description:
      'We believe healthcare technology should feel calm, trustworthy, and respectful—built to protect human dignity across every clinical and daily interaction.',
    icon: Compass,
    gradient: 'linear-gradient(135deg, #0F2756 0%, #1A4DB8 50%, #2563EB 100%)',
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.45)',
  },
  {
    id: 'vision',
    label: 'Vision',
    statement: 'Intelligence serving human well-being without synthetic loops.',
    description:
      'A future where computational intelligence serves genuine emotional well-being without digital noise, synthetic addiction loops, or compromised cognitive boundaries.',
    icon: Eye,
    gradient: 'linear-gradient(135deg, #0C1E3D 0%, #133E87 50%, #0284C7 100%)',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
  },
  {
    id: 'mission',
    label: 'Mission',
    statement: 'Developing provably safe, privacy-first clinical technologies.',
    description:
      'We engineer computational systems where privacy is mathematically guaranteed rather than an optional toggle, serving patients and clinicians with unconditional safety.',
    icon: Shield,
    gradient: 'linear-gradient(135deg, #07152B 0%, #0F326E 50%, #4F46E5 100%)',
    accentColor: '#818CF8',
    glowColor: 'rgba(99, 102, 241, 0.45)',
  },
];

/*
  Realistic 3D Tetrahedral Pyramid Geometry
  Coordinate ViewBox: 0 0 500 440
  Apex:                (250, 38)
  Confluence Vertex:   (250, 248)
  Base-Left Vertex:    (48, 394)
  Base-Right Vertex:   (452, 394)

  Face 0 - Left Facet:        (250, 38)  -> (48, 394)  -> (250, 248)
  Face 1 - Right Facet:       (250, 38)  -> (452, 394) -> (250, 248)
  Face 2 - Base Facet:        (48, 394)  -> (452, 394) -> (250, 248)
*/
const FACET_PATHS = [
  'M 250 38 L 48 394 L 250 248 Z',   // Left Facet (Purpose)
  'M 250 38 L 452 394 L 250 248 Z',  // Right Facet (Vision)
  'M 48 394 L 452 394 L 250 248 Z',  // Base Facet (Mission)
];

const FACET_CENTROIDS = [
  { x: 182, y: 226 }, // Centroid Left
  { x: 318, y: 226 }, // Centroid Right
  { x: 250, y: 346 }, // Centroid Base
];

export const FoundationSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-shift the pyramid in an infinite loop every 4.8 seconds
  const startCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % PILLARS.length);
    }, 4800);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      startCycle();
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, startCycle]);

  const activePillar = PILLARS[activeIdx];
  const ActiveIcon = activePillar.icon;

  return (
    <section
      id="foundation"
      className="relative w-full min-h-0 sm:min-h-screen py-14 sm:py-24 lg:py-18 xl:py-20 px-4 sm:px-8 md:px-12 lg:px-20 flex flex-col justify-center select-none overflow-hidden bg-[#FBFBFE]"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* ── LEFT COLUMN: Staggered progressive reveals ── */}
          <div className="lg:col-span-5 flex flex-col justify-center min-w-0">
            {/* Monumental Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2rem,5.5vw,3.75rem)] font-bold tracking-tight leading-[1.08] text-[#0C1A30]"
            >
              The principles <br />
              that guide <br />
              <span className="text-[#1A56DB] italic font-medium">our work.</span>
            </motion.h2>

            {/* Subtext description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base lg:text-lg text-[#475569] leading-relaxed pt-4 sm:pt-5 max-w-md"
            >
              Three foundational commitments shape every computational architecture, clinical protocol, and user experience we engineer.
            </motion.p>

            {/* Editorial statement block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-slate-200/60 space-y-2 max-w-md"
            >
              <h3 className="text-base sm:text-lg lg:text-[20px] font-semibold tracking-tight text-[#0C1A30] leading-snug">
                Peace, harmony, simplicity,{' '}
                <span className="text-[#1A56DB] italic font-medium">and radical restraint.</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                True technological sophistication is quiet. We refuse attention-traps and dopamine loops in favor of clinical rigor, provable privacy, and genuine human meaning.
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Photorealistic 3D Architectural Pyramid ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-center justify-center relative min-w-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Pyramid Showcase Container */}
            <div className="relative w-full max-w-[460px] sm:max-w-[500px] flex flex-col items-center">
              
              {/* Interactive Photorealistic 3D SVG Pyramid */}
              <div className="relative w-full aspect-[500/420]">
                <svg
                  viewBox="0 0 500 440"
                  className="w-full h-full overflow-visible select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Realistic Specular & Lighting Filters */}
                    <filter id="crystalBloom" x="-25%" y="-25%" width="150%" height="150%">
                      <feGaussianBlur stdDeviation="10" result="glow" />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter id="softDepthShadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#0C1A30" floodOpacity="0.18" />
                    </filter>

                    {/* Left Facet: Primary Light-Facing Shading (Sunlit Top-Left) */}
                    <linearGradient id="realLeftGrad" x1="0.2" y1="0" x2="0.8" y2="1">
                      <stop offset="0%" stopColor="#2E5CB8" />
                      <stop offset="25%" stopColor="#1E3E85" />
                      <stop offset="65%" stopColor="#122554" />
                      <stop offset="100%" stopColor="#0B1736" />
                    </linearGradient>

                    {/* Right Facet: Ambient Rim-Lit Shading (Contrasting Depth) */}
                    <linearGradient id="realRightGrad" x1="0.8" y1="0.1" x2="0.2" y2="0.9">
                      <stop offset="0%" stopColor="#1A3B80" />
                      <stop offset="35%" stopColor="#122754" />
                      <stop offset="70%" stopColor="#0A1633" />
                      <stop offset="100%" stopColor="#050C1F" />
                    </linearGradient>

                    {/* Base Facet: Grounded Horizon Perspective Shading */}
                    <linearGradient id="realBaseGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                      <stop offset="0%" stopColor="#081024" />
                      <stop offset="45%" stopColor="#0F1F40" />
                      <stop offset="85%" stopColor="#162D5C" />
                      <stop offset="100%" stopColor="#1D3C7A" />
                    </linearGradient>

                    {/* Active State Volumetric Luminescence */}
                    <linearGradient id="realActiveGrad" x1="0.1" y1="0" x2="0.9" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="25%" stopColor="#3B82F6" />
                      <stop offset="60%" stopColor="#1D4ED8" />
                      <stop offset="100%" stopColor="#0F2D6B" />
                    </linearGradient>

                    {/* Glass Glare / Specular Sheen (simulates real surface glass reflection) */}
                    <linearGradient id="glassGlare" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                      <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.15" />
                      <stop offset="65%" stopColor="#FFFFFF" stopOpacity="0.0" />
                      <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.08" />
                    </linearGradient>

                    {/* Internal Caustic Highlight */}
                    <radialGradient id="causticSpot" cx="50%" cy="30%" r="60%">
                      <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.45" />
                      <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* ── MULTI-LAYERED REALISTIC GROUND SHADOW ── */}
                  {/* Layer 1: Wide diffuse ambient ground shadow */}
                  <ellipse
                    cx="250"
                    cy="414"
                    rx="220"
                    ry="28"
                    fill="rgba(12, 28, 58, 0.16)"
                    filter="blur(22px)"
                  />
                  {/* Layer 2: Tight ambient occlusion contact shadow */}
                  <ellipse
                    cx="250"
                    cy="404"
                    rx="185"
                    ry="12"
                    fill="rgba(8, 16, 36, 0.4)"
                    filter="blur(8px)"
                  />
                  {/* Layer 3: Direct contact crease right under the bottom baseline */}
                  <path
                    d="M 44 394 Q 250 404 456 394 Q 250 398 44 394 Z"
                    fill="#050C1E"
                    opacity="0.6"
                  />

                  {/* ── THE 3 REALISTIC PYRAMID FACETS ── */}
                  {PILLARS.map((pillar, idx) => {
                    const isActive = activeIdx === idx;
                    const path = FACET_PATHS[idx];
                    const centroid = FACET_CENTROIDS[idx];
                    
                    const defaultFill =
                      idx === 0
                        ? 'url(#realLeftGrad)'
                        : idx === 1
                        ? 'url(#realRightGrad)'
                        : 'url(#realBaseGrad)';

                    return (
                      <g
                        key={pillar.id}
                        onClick={() => setActiveIdx(idx)}
                        className="cursor-pointer"
                        style={{ outline: 'none' }}
                      >
                        {/* Facet Body with 3D Depth */}
                        <motion.path
                          d={path}
                          fill={isActive ? 'url(#realActiveGrad)' : defaultFill}
                          animate={{
                            opacity: isActive ? 1 : 0.88,
                            scale: isActive ? 1.018 : 1,
                          }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            transformOrigin: `${centroid.x}px ${centroid.y}px`,
                          }}
                        />

                        {/* Active Volumetric Caustic Inner Glow */}
                        {isActive && (
                          <motion.path
                            d={path}
                            fill="url(#causticSpot)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                              transformOrigin: `${centroid.x}px ${centroid.y}px`,
                              pointerEvents: 'none',
                            }}
                          />
                        )}

                        {/* Diagonal Glass Specular Glare (Physical light refraction across face) */}
                        <path
                          d={path}
                          fill="url(#glassGlare)"
                          style={{ pointerEvents: 'none', mixBlendMode: 'overlay' }}
                          opacity={isActive ? 0.75 : 0.35}
                        />

                        {/* Facet Interior Shadow Edge (Ambient Occlusion along boundaries) */}
                        <path
                          d={path}
                          fill="none"
                          stroke="rgba(0, 0, 0, 0.35)"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          style={{ pointerEvents: 'none' }}
                        />

                        {/* Active Brilliant Specular Rim Light */}
                        {isActive && (
                          <motion.path
                            d={path}
                            fill="none"
                            stroke="#BAE6FD"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.35 }}
                            filter="url(#crystalBloom)"
                            style={{ pointerEvents: 'none' }}
                          />
                        )}

                        {/* ── REALISTIC FROSTED GLASS PILL BADGE & LABEL ── */}
                        <g
                          style={{ pointerEvents: 'none' }}
                          transform={`translate(${centroid.x}, ${centroid.y})`}
                        >
                          {/* Glassmorphic Badge Capsule */}
                          <motion.rect
                            x={isActive ? -52 : -46}
                            y={-14}
                            width={isActive ? 104 : 92}
                            height={28}
                            rx={14}
                            fill={isActive ? 'rgba(10, 25, 60, 0.75)' : 'rgba(15, 23, 42, 0.45)'}
                            stroke={isActive ? 'rgba(186, 230, 253, 0.6)' : 'rgba(255, 255, 255, 0.22)'}
                            strokeWidth={isActive ? 1.5 : 1}
                            animate={{
                              scale: isActive ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.35 }}
                          />

                          {/* Radiant Indicator Gem */}
                          <circle
                            cx={isActive ? -34 : -30}
                            cy={0}
                            r={isActive ? 4 : 3.5}
                            fill={isActive ? '#38BDF8' : 'rgba(255, 255, 255, 0.75)'}
                            filter={isActive ? 'drop-shadow(0 0 6px #60A5FA)' : 'none'}
                          />

                          {/* Active Pulsing Aura */}
                          {isActive && (
                            <motion.circle
                              cx={-34}
                              cy={0}
                              r={8}
                              fill="none"
                              stroke="#60A5FA"
                              strokeWidth="1.2"
                              initial={{ scale: 0.8, opacity: 0.9 }}
                              animate={{ scale: 1.6, opacity: 0 }}
                              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                            />
                          )}

                          {/* Crisp Typography */}
                          <text
                            x={isActive ? 4 : 2}
                            y={4}
                            textAnchor="middle"
                            fill="#FFFFFF"
                            fontFamily="'Google Sans', 'Google Sans Text', sans-serif"
                            fontSize={isActive ? 13.5 : 12.5}
                            fontWeight={isActive ? 700 : 600}
                            letterSpacing="0.04em"
                            style={{
                              textShadow: '0 2px 8px rgba(0, 0, 0, 0.85)',
                            }}
                          >
                            {pillar.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* ── 3D PHYSICAL BEVELED RIDGE LINES (The key to photorealism) ── */}
                  {/* Central Ridge (Apex to Confluence): Dual-Stroke Light & Shadow */}
                  <line
                    x1="249"
                    y1="38"
                    x2="249"
                    y2="248"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeOpacity="0.8"
                    style={{ pointerEvents: 'none' }}
                  />
                  <line
                    x1="251"
                    y1="38"
                    x2="251"
                    y2="248"
                    stroke="#060E21"
                    strokeWidth="1.5"
                    strokeOpacity="0.75"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Left Confluence Ridge (Confluence to Bottom-Left) */}
                  <line
                    x1="250"
                    y1="247"
                    x2="48"
                    y2="393"
                    stroke="#BAE6FD"
                    strokeWidth="1.2"
                    strokeOpacity="0.7"
                    style={{ pointerEvents: 'none' }}
                  />
                  <line
                    x1="250"
                    y1="249"
                    x2="48"
                    y2="395"
                    stroke="#040A18"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Right Confluence Ridge (Confluence to Bottom-Right) */}
                  <line
                    x1="250"
                    y1="247"
                    x2="452"
                    y2="393"
                    stroke="#60A5FA"
                    strokeWidth="1.2"
                    strokeOpacity="0.6"
                    style={{ pointerEvents: 'none' }}
                  />
                  <line
                    x1="250"
                    y1="249"
                    x2="452"
                    y2="395"
                    stroke="#030814"
                    strokeWidth="1.5"
                    strokeOpacity="0.85"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Outer Beveled Pyramid Silhouette */}
                  <path
                    d="M 250 38 L 452 394 L 48 394 Z"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* Apex Light Glint (Crowning light reflection at apex peak) */}
                  <circle
                    cx="250"
                    cy="38"
                    r="4"
                    fill="#FFFFFF"
                    filter="drop-shadow(0 0 6px #BAE6FD)"
                    style={{ pointerEvents: 'none' }}
                  />
                </svg>
              </div>

              {/* ── ACTIVE PILLAR INSIGHT (Open Editorial Text, No Enclosing Container) ── */}
              <div className="w-full mt-4 sm:mt-6 text-center sm:text-left">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePillar.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-1.5"
                  >
                    <h4 className="text-lg font-bold text-[#0C1A30]">
                      {activePillar.label}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                      {activePillar.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
