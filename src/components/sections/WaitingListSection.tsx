import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import PastelSilkGL from './PastelSilkGL';
import { MythriPrivacyPolicySquare } from './MythriPrivacyPolicySquare';

export const WaitingListSection: React.FC = () => {
  const [isPolicySquareOpen, setIsPolicySquareOpen] = useState(false);
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const [joinedEmail, setJoinedEmail] = useState<string | null>(null);

  return (
    <section
      id="mythri"
      style={{ scrollSnapAlign: 'center' }}
      className="relative w-full min-h-screen px-6 sm:px-12 lg:px-20 pt-24 sm:pt-28 lg:py-14 pb-12 border-t border-slate-200/80 flex flex-col justify-center overflow-hidden select-none"
    >
      {/* Live Interactive WebGL Pastel Silk Background */}
      <div className="absolute inset-0 z-0">
        <PastelSilkGL
          src="/assets/mythri_pastel_art.jpg"
          className="w-full h-full"
        />
        {/* Soft daylight ambient overlay for pure typographic contrast */}
        <div className="absolute inset-0 bg-white/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/50 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center pointer-events-none">
        {/* 2-Column Responsive Layout: Left Editorial + Right Perfect Square Privacy Policy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center my-auto py-2">
          
          {/* LEFT COLUMN: Editorial Storytelling & Early Access Action */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-5 pointer-events-auto">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#1D4E89] block">
              Product Horizon · Mythri Companion
            </span>

            <h2 className="text-[28px] sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-bold tracking-tight leading-[1.12] sm:leading-[1.08] text-[#0C1A30]">
              Something more <span className="text-[#1D4E89] italic">thoughtful</span> is on its way.
            </h2>

            <p className="text-sm sm:text-lg text-[#334155] leading-relaxed max-w-xl">
              Mythri is designed as a calm, supportive companion navigating loneliness and everyday emotional anxiety — grounded in deterministic clinical safety.
            </p>

            {/* Early Access Action Bar with Linked Agreement Checkbox */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsPolicySquareOpen(prev => !prev)}
                className={`inline-flex items-center justify-center gap-3 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer group shrink-0 ${
                  isPolicySquareOpen
                    ? 'bg-[#1D4E89] text-white ring-2 ring-[#1D4E89]/30'
                    : 'bg-[#0C1A30] text-white hover:bg-[#1D4E89]'
                }`}
              >
                <span>{isPolicySquareOpen ? 'Close Privacy Policy' : 'Request Early Access'}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isPolicySquareOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>

              {/* Checkbox beside the button */}
              <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all select-none ${
                  joinedEmail
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : isPolicyAgreed
                    ? 'bg-blue-50 border-blue-200 text-[#0C1A30]'
                    : isPolicySquareOpen
                    ? 'bg-slate-50/90 border-slate-200/80 text-[#64748B]'
                    : 'bg-white/60 border-slate-200/60 text-[#94A3B8] opacity-75'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                    joinedEmail
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isPolicyAgreed
                      ? 'bg-[#1A56DB] border-[#1A56DB] text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {(isPolicyAgreed || joinedEmail) && <Check className="w-3 h-3 stroke-[3]" />}
                </div>

                <div className="text-xs leading-none">
                  {joinedEmail ? (
                    <span className="font-semibold text-emerald-700">Joined waitlist</span>
                  ) : isPolicyAgreed ? (
                    <span className="font-semibold text-[#1A56DB]">Policy agreed · Enter email</span>
                  ) : (
                    <span className="font-medium">
                      {isPolicySquareOpen ? 'Scroll policy to agree' : 'Requires policy agreement'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Subtle Clinical Trust Badge */}
            <div className="flex items-center gap-2 pt-1 text-xs text-[#64748B]">
              <ShieldCheck className="w-4 h-4 text-[#1D4E89]" />
              <span>Provably safe, zero-egress psychiatric architecture</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Perfect Square Side Screen for Privacy Policy & Squeeze-In Email Join */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end pointer-events-auto">
            <AnimatePresence mode="wait">
              {isPolicySquareOpen && (
                <MythriPrivacyPolicySquare
                  isOpen={isPolicySquareOpen}
                  onClose={() => setIsPolicySquareOpen(false)}
                  onSuccess={(submittedEmail) => {
                    setIsPolicyAgreed(true);
                    setJoinedEmail(submittedEmail);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
