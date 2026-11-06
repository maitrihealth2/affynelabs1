import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { PolicyModal } from '../modals/PolicyModal';
import type { ContactFormData, SectionId } from '../../types';

interface ContactSectionProps {
  onNavigate: (sectionId: SectionId) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    organization: '',
    subject: 'Clinical Partnership',
    message: '',
    privacyAgreed: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.fullName.trim()) { setSubmitError('Please enter your full name.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) { setSubmitError('Please provide a valid email address.'); return; }
    if (!formData.message.trim() || formData.message.trim().length < 6) { setSubmitError('Please provide a message with at least 6 characters.'); return; }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit message.');
      setSubmitSuccess(result.message);
      setFormData({ fullName: '', email: '', organization: '', subject: 'Clinical Partnership', message: '', privacyAgreed: true });
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen py-16 sm:py-24 lg:py-20 flex flex-col justify-center overflow-hidden select-none bg-[#FAFBFD]"
    >
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-20 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* ——— LEFT: Staggered editorial storytelling ——— */}
          <div className="space-y-6 sm:space-y-7 min-w-0">
            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.75rem,5.5vw,3.35rem)] font-bold tracking-tight leading-[1.08] text-[#0C1A30]"
            >
              Let us build{' '}
              <span className="text-[#1D4E89] italic">understanding</span>{' '}
              together.
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-md"
            >
              Whether you are a clinician, academic researcher, or healthcare partner dedicated to human-centered technology — we welcome every dialogue.
            </motion.p>

            {/* Thin rule */}
            <div className="h-px w-20 bg-[#1D4E89]/20" />

            {/* Contact info items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.25 }}
              transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-full border border-[#1D4E89]/20 flex items-center justify-center text-[#1D4E89] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-0.5">Headquarters</p>
                  <p className="text-sm font-semibold text-[#0C1A30]">Bengaluru, Karnataka, India</p>
                  <p className="text-xs text-[#64748B]">Engineering &amp; Clinical Research Lab</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-full border border-[#1D4E89]/20 flex items-center justify-center text-[#1D4E89] shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-0.5">Direct Contact</p>
                  <a href="mailto:contact@affynelabs.com" className="text-sm font-semibold text-[#1D4E89] hover:underline">
                    contact@affynelabs.com
                  </a>
                  <p className="text-xs text-[#64748B]">General, partnership &amp; clinical queries</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-0.5 w-8 h-8 rounded-full border border-[#1D4E89]/20 flex items-center justify-center text-[#1D4E89] shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-0.5">Response Window</p>
                  <p className="text-sm font-semibold text-[#0C1A30]">Within 24–48 business hours</p>
                  <p className="text-xs text-[#64748B]">Every inquiry reviewed by our clinical team</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ——— RIGHT: Staggered clean interactive form (Open Editorial, No Container Box) ——— */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0 max-w-xl"
          >
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-start gap-5 py-8"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#0C1A30] mb-1">Message Received</h4>
                    <p className="text-sm text-[#475569]">{submitSuccess}</p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(null)}
                    className="text-xs font-semibold text-[#1D4E89] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Send another <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Full Name */}
                  <div className="group border-b border-slate-200 focus-within:border-[#1D4E89] transition-colors duration-200 py-3.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5 group-focus-within:text-[#1D4E89] transition-colors duration-200">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Dr. Eleanor Vance"
                      className="w-full bg-transparent text-sm text-[#0C1A30] placeholder:text-[#CBD5E1] focus:outline-none py-0.5"
                    />
                  </div>

                  {/* Email */}
                  <div className="group border-b border-slate-200 focus-within:border-[#1D4E89] transition-colors duration-200 py-3.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5 group-focus-within:text-[#1D4E89] transition-colors duration-200">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="eleanor@institution.edu"
                      className="w-full bg-transparent text-sm text-[#0C1A30] placeholder:text-[#CBD5E1] focus:outline-none py-0.5"
                    />
                  </div>

                  {/* Organization */}
                  <div className="group border-b border-slate-200 focus-within:border-[#1D4E89] transition-colors duration-200 py-3.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5 group-focus-within:text-[#1D4E89] transition-colors duration-200">
                      Organization{' '}
                      <span className="normal-case font-normal tracking-normal text-[#CBD5E1]">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="AIIMS, WHO, independent practice…"
                      className="w-full bg-transparent text-sm text-[#0C1A30] placeholder:text-[#CBD5E1] focus:outline-none py-0.5"
                    />
                  </div>

                  {/* Message */}
                  <div className="group border-b border-slate-200 focus-within:border-[#1D4E89] transition-colors duration-200 py-3.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1.5 group-focus-within:text-[#1D4E89] transition-colors duration-200">
                      Message *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your perspective or collaborative research interest…"
                      className="w-full bg-transparent text-sm text-[#0C1A30] placeholder:text-[#CBD5E1] focus:outline-none resize-none py-0.5"
                    />
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 flex items-center gap-2 text-xs text-rose-600">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button row */}
                  <div className="pt-5 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0C1A30] hover:bg-[#1D4E89] text-white text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-[#94A3B8] leading-snug text-center">
                      By submitting you agree to our{' '}
                      <button
                        type="button"
                        onClick={() => setIsPolicyModalOpen(true)}
                        className="text-[#1D4E89] hover:underline cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                      .
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>

      <PolicyModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} />
    </section>
  );
};
