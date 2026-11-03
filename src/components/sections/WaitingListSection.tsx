import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, X } from 'lucide-react';
import { PolicyModal } from '../modals/PolicyModal';
import PastelSilkGL from './PastelSilkGL';

export const WaitingListSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<{
    message: string;
    position?: number;
  } | null>(null);
  const [isEarlyAccessOpen, setIsEarlyAccessOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setSubmitError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit early access request.');
      }

      setSubmitSuccess({
        message: result.message,
        position: result.position,
      });
      setEmail('');
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="mythri"
      className="relative w-full h-screen min-h-[620px] max-h-screen px-6 sm:px-12 lg:px-20 py-10 lg:py-14 border-t border-slate-200/80 flex flex-col justify-between snap-start overflow-hidden select-none"
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

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between pointer-events-none">
        {/* Top Spacer */}
        <div className="pt-1" />

        {/* Central Editorial Layout (No Containers, No Inline Mail Input) */}
        <div className="my-auto max-w-2xl py-4 space-y-6 pointer-events-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4E89] block">
            Product Horizon · Mythri Companion
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-bold tracking-tight leading-[1.08] text-[#0C1A30]">
            Something more <span className="text-[#1D4E89] italic">thoughtful</span> is on its way.
          </h2>

          <p className="text-base sm:text-lg text-[#334155] leading-relaxed max-w-xl">
            Mythri is designed as a calm, supportive companion navigating loneliness and everyday emotional anxiety — grounded in deterministic clinical safety.
          </p>

          {/* Prominent CTA Button to Request Early Access */}
          <div className="pt-2">
            <button
              onClick={() => setIsEarlyAccessOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#0C1A30] hover:bg-[#1D4E89] active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer group"
            >
              <span>Request Early Access</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Quiet Bottom Footprint Placeholder */}
        <div className="pt-2" />
      </div>

      {/* Early Access Modal Dialogue (Opens when button is clicked) */}
      <AnimatePresence>
        {isEarlyAccessOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEarlyAccessOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10"
            >
              {/* Close button */}
              <button
                onClick={() => setIsEarlyAccessOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4E89] block mb-1.5">
                  Early Access Waitlist
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0C1A30] tracking-tight mb-2">
                  Join Mythri
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  Enter your email address to receive priority access to our clinical companion.
                </p>
              </div>

              {submitSuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-[#0C1A30]">Registered on Waiting List</h4>
                  <p className="text-xs text-[#475569]">{submitSuccess.message}</p>
                  {submitSuccess.position && (
                    <div className="inline-block px-3 py-1 bg-white border border-slate-200 text-[#1D4E89] rounded-full text-xs font-medium">
                      Queue Position #{submitSuccess.position}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSubmitSuccess(null);
                      setIsEarlyAccessOpen(false);
                    }}
                    className="block w-full mt-3 py-2 text-xs font-semibold text-[#1D4E89] hover:underline cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      disabled={isSubmitting}
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#0C1A30] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89] focus:bg-white transition-all"
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-[#0C1A30] hover:bg-[#1D4E89] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Securing invitation...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </section>
  );
};
