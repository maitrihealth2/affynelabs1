import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, MapPin, Clock } from 'lucide-react';
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

    if (!formData.fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      setSubmitError('Please provide a valid email address.');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 6) {
      setSubmitError('Please provide a message with at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit message.');
      }

      setSubmitSuccess(result.message);
      setFormData({
        fullName: '',
        email: '',
        organization: '',
        subject: 'Clinical Partnership',
        message: '',
        privacyAgreed: true,
      });
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full h-screen min-h-[620px] max-h-screen px-6 sm:px-12 lg:px-20 py-8 lg:py-10 border-t border-slate-200/80 flex flex-col justify-between snap-start overflow-hidden select-none"
    >
      {/* Background Pastel Artwork with Soft Ambient Contrast Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/contact_pastel_art.jpg"
          alt="Contact Pastel Atmosphere"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
        {/* Soft daylight gradient overlay for crystal-clear readability */}
        <div className="absolute inset-0 bg-white/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-between">
        {/* Section Header */}
        <div className="pt-4 sm:pt-6">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1D4E89] block mb-1.5">
              Dialogue · Clinical Partnerships · Inquiry
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-bold tracking-tight leading-[1.08] text-[#0C1A30] mb-2">
              Let us build <span className="text-[#1D4E89] italic">understanding</span> together.
            </h2>
            <p className="text-sm sm:text-base text-[#334155] leading-relaxed max-w-2xl">
              Whether you are a clinician, academic researcher, or healthcare partner dedicated to human-centered technology, we welcome dialogue.
            </p>
          </div>
        </div>

        {/* Central 2-Column Split: Seamless Editorial Touchpoints + Form (Zero Boxed Containers) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center my-auto py-2">
          {/* Left Column: Direct Inquiries Info (Pure editorial items, no card containers) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white/90 border border-slate-200/80 flex items-center justify-center text-[#1D4E89] shadow-xs shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#0F223D]">
                  Headquarters
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] font-medium">Bengaluru, Karnataka, India</p>
                <p className="text-xs text-[#64748B]">Engineering & Clinical Research Lab</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white/90 border border-slate-200/80 flex items-center justify-center text-[#1D4E89] shadow-xs shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#0F223D]">
                  Direct Contact
                </h3>
                <a
                  href="mailto:contact@affynelabs.com"
                  className="text-xs sm:text-sm text-[#1D4E89] font-semibold hover:underline block"
                >
                  contact@affynelabs.com
                </a>
                <p className="text-xs text-[#64748B]">General, partnership & clinical queries</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white/90 border border-slate-200/80 flex items-center justify-center text-[#1D4E89] shadow-xs shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#0F223D]">
                  Response Window
                </h3>
                <p className="text-xs sm:text-sm text-[#334155] font-medium">Within 24–48 business hours</p>
                <p className="text-xs text-[#64748B]">Every inquiry is reviewed directly by our clinical team</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (Directly on layout, zero container cards) */}
          <div className="lg:col-span-7">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-center space-y-2.5 max-w-lg"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[#0C1A30]">Message Received</h4>
                <p className="text-xs sm:text-sm text-[#475569] max-w-sm mx-auto">{submitSuccess}</p>
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="mt-2 text-xs font-semibold text-[#1D4E89] hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Dr. Eleanor Vance"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/95 border border-slate-300 text-sm text-[#0C1A30] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89] transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="eleanor@institution.edu"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/95 border border-slate-300 text-sm text-[#0C1A30] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89] transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your perspective or collaborative research interest..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/95 border border-slate-300 text-sm text-[#0C1A30] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1D4E89]/30 focus:border-[#1D4E89] transition-all shadow-xs resize-none"
                  />
                </div>

                {submitError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-full bg-[#0C1A30] hover:bg-[#1D4E89] text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quiet Bottom Footprint Placeholder */}
        <div className="pt-2" />
      </div>

      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </section>
  );
};
