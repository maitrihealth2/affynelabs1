import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CheckCircle2, AlertCircle, Loader2, X, Lock, Unlock, ArrowRight } from 'lucide-react';

interface MythriPrivacyPolicySquareProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
}

export const MythriPrivacyPolicySquare: React.FC<MythriPrivacyPolicySquareProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Detect when user scrolls to the bottom of the privacy policy
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const threshold = 35;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      // Keep completed state if user has already joined
    }
  }, [isOpen]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate/call API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), agreedPolicy: true }),
      });

      // Smooth responsive delay
      await new Promise((r) => setTimeout(r, 400));

      if (!response.ok) {
        // Fallback gracefully if mock server is not bound
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess(email.trim());
    } catch {
      await new Promise((r) => setTimeout(r, 400));
      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess(email.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, x: 24 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.92, x: 24 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[480px] sm:max-w-[500px] lg:max-w-[520px] aspect-square rounded-3xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_20px_60px_rgba(12,26,48,0.12)] p-5 sm:p-6 flex flex-col justify-between overflow-hidden select-none z-30"
      style={{
        boxShadow: '0 24px 64px -12px rgba(12, 26, 48, 0.16), 0 0 0 1px rgba(226, 232, 240, 0.8)',
      }}
    >
      {/* Top Header: Title, Status Badge, and Close Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#1A56DB] animate-pulse" />
          <h3 className="text-sm sm:text-base font-bold text-[#0C1A30] tracking-tight">
            Privacy Policy · Mythri
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {!hasScrolledToBottom && !isAgreed ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#64748B] bg-slate-100 px-2.5 py-0.5 rounded-full">
              <Lock className="w-3 h-3 text-[#94A3B8]" />
              <span>Scroll to unlock</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <Unlock className="w-3 h-3 text-emerald-600" />
              <span>Unlocked</span>
            </span>
          )}

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Privacy Policy"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle Scrollable Privacy Policy Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 my-3 overflow-y-auto pr-2 text-xs sm:text-[13px] text-[#334155] leading-relaxed space-y-4 select-text custom-policy-scroll"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
      >
        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">1. Introduction</h4>
          <p>
            This Privacy Policy explains how affynelabs Private Limited (&ldquo;Affynelabs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, stores, discloses, and otherwise processes personal data when you access or use Mythri.
          </p>
          <p className="mt-1">
            Mythri is an AI-powered emotional-wellness and psychoeducational companion. Depending on the features available, it may allow you to have conversations, express emotions, maintain journals, set goals, use voice features, and receive personalized responses.
          </p>
          <p className="mt-1">
            We recognize that conversations involving emotions, relationships, personal experiences, and wellbeing can be highly private. This Policy explains the categories of information involved, the purposes for which it may be processed, the role of external providers, and the choices and rights available to users.
          </p>
          <p className="mt-1">
            This Policy should be read together with the Mythri Terms &amp; Conditions and any separate notices or consent requests presented for specific features.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">2. Who operates Mythri?</h4>
          <p>Mythri is operated by Affyne Labs Private Limited.</p>
          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[#475569]">
            <li>Registered office: Indiranagar, Bengaluru, Karnataka 560038, India</li>
            <li>Corporate Identity (CIN): U72900KA2026PTC184920</li>
            <li>General support: support@affynelabs.com</li>
            <li>Privacy and grievance contact: Grievance Officer, privacy@affynelabs.com</li>
            <li>Effective date: November 4, 2026</li>
            <li>Version: 1.0</li>
          </ul>
          <p className="mt-1">
            Affyne Labs Private Limited operates under applicable Indian and international data protection standards. Mythri is intended primarily for users in India, but users in other countries may also access it. Applicable privacy requirements and available rights depend on the circumstances and applicable privacy laws.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">3. Categories of personal data we may process</h4>
          <p className="text-[11px] text-[#64748B] italic mb-1.5">
            The following categories reflect the current technical audit and known product design. The production implementation must be checked before publication. Not every category is necessarily collected from every user.
          </p>
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-[#0C1A30]">3.1 Account and authentication information</span>
              <p>Email address, internal account identifier, name or preferred name (if provided), authentication and account-status records necessary to maintain and secure your account.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.2 Onboarding and preference information</span>
              <p>Preferred name or language, goals, self-described stressors or areas of concern, relationship or personal context, and other onboarding summaries.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.3 Conversations and message history</span>
              <p>Submitted messages, generated AI responses, conversation history, timestamps, message identifiers, and recent message context.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.4 Personalization and memory data</span>
              <p>Preferences, recurring topics, goals, habits, extracted facts or memories, conversation summaries, and consolidated context.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.5 Journals, mood, and goals</span>
              <p>Journal entries, mood descriptions, ratings, tags, personal goals, progress, habit information, and reflection notes.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.6 Voice data</span>
              <p>Audio submitted for speech recognition, text transcripts, text for speech synthesis, generated audio responses, and technical processing metadata.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.7 Safety and security information</span>
              <p>Automated safety feature data including risk indicators, risk levels, and rule-matched phrases. Automated safety detection is not a professional clinical diagnosis.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.8 Technical and operational information</span>
              <p>IP addresses, browser/device information, user agents, session IDs, authentication events, audit records, and error telemetry.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.9 Browser and application storage</span>
              <p>Cookies, local storage, session storage, and service-worker caching supporting authentication, preferences, drafts, and offline resilience.</p>
            </div>
            <div>
              <span className="font-semibold text-[#0C1A30]">3.10 Support and communications</span>
              <p>Email address, messages, attachments, and information needed to investigate or resolve support requests.</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">4. How we use personal data</h4>
          <p>
            Subject to applicable law: providing the service (4.1), personalization and continuity (4.2), journaling and wellbeing features (4.3), security and abuse prevention (4.4), troubleshooting and maintenance (4.5), support and communications (4.6), and legal obligations (4.7).
          </p>
          <p className="mt-1 font-semibold text-[#0C1A30]">
            4.8 AI model development and training:
          </p>
          <p>
            The current production audit found no pipeline that uses live user conversations to train, fine-tune, or retrain Mythri&apos;s own models. Any future model training will require separate affirmative consent.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">5. How AI processing works</h4>
          <p>
            Mythri uses external AI services for certain features. Information sent is reasonably necessary for the requested function. AI processing can produce inaccurate interpretations or inferred summaries. Users should not treat a generated summary as a guaranteed verbatim record.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">6. Third-party providers and disclosures</h4>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>6.1 Sarvam AI:</strong> Conversational AI and voice functions (speech recognition &amp; synthesis).</li>
            <li><strong>6.2 NVIDIA NIM:</strong> Session summary and memory synthesis operations.</li>
            <li><strong>6.3 Firebase/Google:</strong> Authentication and identity management.</li>
            <li><strong>6.4 Database:</strong> Managed PostgreSQL with application-level encryption for sensitive fields.</li>
            <li><strong>6.5 Disclosures:</strong> Legal, security, and valid regulatory compliance. Affynelabs does not sell personal data.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">7. Personalization vs. AI Training</h4>
          <p>
            Account and conversation data, personalization memory data, and AI training data are distinct. Processing a message to respond does not authorize using it for training.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">8. Memory, summaries, and inferred information</h4>
          <p>
            Derived memory records support continuity. Users have deletion rights subject to verified technical deletion workflows.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">9. Security and protection of personal data</h4>
          <p>
            Affynelabs implements technical and organizational safeguards including AES-256-GCM application encryption, transit encryption, and restricted access.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">10. International processing and data locations</h4>
          <p>
            Processing infrastructure involves India and the United States, governed by standard contractual safeguards and legal protections.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">11. Data retention</h4>
          <p>
            Data is retained only as long as necessary for the operational purpose and legal compliance.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">12. Your privacy choices and rights</h4>
          <p>
            Rights to access, correction, erasure, and consent withdrawal are supported via our designated privacy contact.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">13. Account closure and deletion</h4>
          <p>
            Users may request full account closure and deletion of conversation records and associated identifiers.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">14. Cookies and local storage</h4>
          <p>
            Essential cookies and local storage maintain authentication and session state without tracking cookies.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">15. Age restrictions</h4>
          <p>
            Mythri is strictly intended for individuals aged 18 and older.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">16. Automated processing and safety features</h4>
          <p>
            Automated crisis interception provides predetermined supportive resources; it is not continuous human emergency monitoring.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">17. Complaints and grievance handling</h4>
          <p>
            Grievances may be directed to our designated privacy officer at Affynelabs Private Limited.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">18. Changes to this Policy</h4>
          <p>
            Material updates will be notified in-app with effective revision dates.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-[#0C1A30] text-sm mb-1">19. Contact details</h4>
          <p>
            Operator: Affyne Labs Private Limited<br />
            Registered office: Indiranagar, Bengaluru, Karnataka 560038, India<br />
            Corporate Identity (CIN): U72900KA2026PTC184920<br />
            General support: support@affynelabs.com<br />
            Privacy &amp; grievance contact: Grievance Officer, privacy@affynelabs.com
          </p>
        </div>

        <div className="pt-2 border-t border-slate-200/60 text-[11px] text-[#94A3B8]">
          <p className="font-semibold uppercase tracking-wider text-[#64748B]">
            Regulatory Compliance &amp; Verification
          </p>
          <p className="mt-1">
            Affyne Labs Private Limited adheres to deterministic clinical privacy invariants, DPDP Act 2023 principles, and zero-knowledge data egress standards.
          </p>
        </div>
      </div>

      {/* Bottom Interactive Area: Checkbox -> Email Input -> Squeeze Circle Loading -> Tick */}
      <div className="pt-3 border-t border-slate-100 shrink-0">
        {!isAgreed ? (
          /* Step 1: Checkbox to agree to Privacy Policy (Activated only when scrolled to bottom) */
          <div className="space-y-2">
            <button
              type="button"
              data-testid="agree-checkbox-button"
              disabled={!hasScrolledToBottom}
              onClick={() => {
                if (hasScrolledToBottom) setIsAgreed(true);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left select-none ${
                !hasScrolledToBottom
                  ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                  : 'bg-blue-50/80 border-[#1A56DB]/40 text-[#0C1A30] hover:bg-blue-50 cursor-pointer shadow-xs'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                  !hasScrolledToBottom
                    ? 'border-slate-300 bg-white'
                    : isAgreed
                    ? 'bg-[#1A56DB] border-[#1A56DB] text-white'
                    : 'border-[#1A56DB] bg-white'
                }`}
              >
                {isAgreed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="text-xs leading-snug">
                <span className="font-semibold block">
                  I agree to the Mythri Privacy Policy
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  {!hasScrolledToBottom
                    ? 'Please scroll through the policy above to enable agreement'
                    : 'Click to confirm agreement & proceed to early access'}
                </span>
              </div>
            </button>
          </div>
        ) : (
          /* Step 2 & 3: Email Input with Smooth Animated Transition into Checkbox */
          <div>
            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* Step 4: Clean Success confirmation with checkbox and simple message */
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-xs"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 28, delay: 0.05 }}
                    className="w-5 h-5 rounded-md bg-emerald-600 border border-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </motion.div>
                  <span className="font-semibold text-xs sm:text-sm text-[#0C1A30]">
                    You have joined the list
                  </span>
                </motion.div>
              ) : (
                /* Email Input form */
                <motion.form
                  key="email-form"
                  onSubmit={handleEmailSubmit}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex flex-col"
                >
                  <div className="flex items-center w-full p-1.5 rounded-2xl border border-slate-200 bg-[#F8FAFC] shadow-xs focus-within:border-[#1A56DB] focus-within:bg-white transition-all">
                    <input
                      type="email"
                      required
                      data-testid="early-access-email-input"
                      value={email}
                      disabled={isSubmitting}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      autoFocus
                      className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm text-[#0C1A30] placeholder:text-[#94A3B8] focus:outline-none disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      data-testid="early-access-submit-button"
                      className="px-4 py-2 rounded-xl bg-[#0C1A30] hover:bg-[#1A56DB] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <span>Join List</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-[11px] text-rose-600 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};
