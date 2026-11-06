import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Maximize2, Minimize2, ShieldCheck } from 'lucide-react';
import { WaitlistPillInput } from '../ui/WaitlistPillInput';

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
  const [isMobile, setIsMobile] = useState(false);
  const [isMaximized, setIsMaximized] = useState(true);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Lock body scroll while full screen privacy policy is open
  useEffect(() => {
    if (!isOpen) return;
    if (isMobile || isMaximized) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, isMobile, isMaximized]);

  // Escape key handler to close or restore
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isMaximized && !isMobile) {
          setIsMaximized(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMaximized, isMobile, onClose]);

  // Detect when user scrolls to the bottom of the privacy policy
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const threshold = 40;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen || !mounted) return null;

  // Shared Policy Document Content Body
  const renderPolicyContent = (isCompact: boolean) => {
    const headingClass = isCompact
      ? 'font-bold text-[#0C1A30] text-sm mb-1'
      : 'font-bold text-[#0C1A30] text-sm sm:text-lg mb-1.5 sm:mb-2';

    const subHeadingClass = isCompact
      ? 'font-semibold text-[#0C1A30] text-xs'
      : 'font-semibold text-[#0C1A30] text-xs sm:text-[15px]';

    const textSpacing = isCompact ? 'space-y-3.5' : 'space-y-5 sm:space-y-6';

    return (
      <div className={textSpacing}>
        <div>
          <h4 className={headingClass}>1. Introduction</h4>
          <p>
            This Privacy Policy explains how Affyne Labs Private Limited (&ldquo;Affynelabs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, stores, discloses, and otherwise processes personal data when you access or use Mythri.
          </p>
          <p className="mt-1.5">
            Mythri is an AI-powered emotional-wellness and psychoeducational companion. Depending on the features available, it may allow you to have conversations, express emotions, maintain journals, set goals, use voice features, and receive personalized responses.
          </p>
          <p className="mt-1.5">
            We recognize that conversations involving emotions, relationships, personal experiences, and wellbeing can be highly private. This Policy explains the categories of information involved, the purposes for which it may be processed, the role of external providers, and the choices and rights available to users.
          </p>
          <p className="mt-1.5">
            This Policy should be read together with the Mythri Terms &amp; Conditions and any separate notices or consent requests presented for specific features.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>2. Who operates Mythri?</h4>
          <p>Mythri is operated by Affyne Labs Private Limited.</p>
          <ul className="list-disc pl-5 mt-1.5 space-y-1">
            <li>Registered office: Indiranagar, Bengaluru, Karnataka 560038, India</li>
            <li>Corporate Identity (CIN): U72900KA2026PTC184920</li>
            <li>General support: support@affynelabs.com</li>
            <li>Privacy and grievance contact: Grievance Officer, privacy@affynelabs.com</li>
            <li>Effective date: November 4, 2026 · Version: 1.0</li>
          </ul>
          <p className="mt-1.5">
            Affyne Labs Private Limited operates under applicable Indian and international data protection standards. Mythri is intended primarily for users in India, but users in other countries may also access it. Applicable privacy requirements and available rights depend on the circumstances and applicable privacy laws.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>3. Categories of personal data we may process</h4>
          <p className="italic text-slate-500 mb-2">
            The following categories reflect the current technical audit and known product design. Not every category is necessarily collected from every user.
          </p>
          <div className="space-y-3">
            <div>
              <span className={subHeadingClass}>3.1 Account and authentication information</span>
              <p className="mt-0.5">Email address, internal account identifier, name or preferred name (if provided), authentication and account-status records necessary to maintain and secure your account.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.2 Onboarding and preference information</span>
              <p className="mt-0.5">Preferred name or language, goals, self-described stressors or areas of concern, relationship or personal context, and other onboarding summaries.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.3 Conversations and message history</span>
              <p className="mt-0.5">Submitted messages, generated AI responses, conversation history, timestamps, message identifiers, and recent message context.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.4 Personalization and memory data</span>
              <p className="mt-0.5">Preferences, recurring topics, goals, habits, extracted facts or memories, conversation summaries, and consolidated context.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.5 Journals, mood, and goals</span>
              <p className="mt-0.5">Journal entries, mood descriptions, ratings, tags, personal goals, progress, habit information, and reflection notes.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.6 Voice data</span>
              <p className="mt-0.5">Audio submitted for speech recognition, text transcripts, text for speech synthesis, generated audio responses, and technical processing metadata.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.7 Safety and security information</span>
              <p className="mt-0.5">Automated safety feature data including risk indicators, risk levels, and rule-matched phrases. Automated safety detection is not a professional clinical diagnosis.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.8 Technical and operational information</span>
              <p className="mt-0.5">IP addresses, browser/device information, user agents, session IDs, authentication events, audit records, and error telemetry.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.9 Browser and application storage</span>
              <p className="mt-0.5">Cookies, local storage, session storage, and service-worker caching supporting authentication, preferences, drafts, and offline resilience.</p>
            </div>
            <div>
              <span className={subHeadingClass}>3.10 Support and communications</span>
              <p className="mt-0.5">Email address, messages, attachments, and information needed to investigate or resolve support requests.</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className={headingClass}>4. How we use personal data</h4>
          <p>
            Subject to applicable law: providing the service (4.1), personalization and continuity (4.2), journaling and wellbeing features (4.3), security and abuse prevention (4.4), troubleshooting and maintenance (4.5), support and communications (4.6), and legal obligations (4.7).
          </p>
          <p className="mt-2 font-semibold text-[#0C1A30]">
            4.8 AI model development and training:
          </p>
          <p className="mt-0.5">
            The current production audit found no pipeline that uses live user conversations to train, fine-tune, or retrain Mythri&apos;s own models. Any future model training will require separate affirmative consent.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>5. How AI processing works</h4>
          <p>
            Mythri uses external AI services for certain features. Information sent is reasonably necessary for the requested function. AI processing can produce inaccurate interpretations or inferred summaries. Users should not treat a generated summary as a guaranteed verbatim record.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>6. Third-party providers and disclosures</h4>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>6.1 Sarvam AI:</strong> Conversational AI and voice functions (speech recognition &amp; synthesis).</li>
            <li><strong>6.2 NVIDIA NIM:</strong> Session summary and memory synthesis operations.</li>
            <li><strong>6.3 Firebase/Google:</strong> Authentication and identity management.</li>
            <li><strong>6.4 Database:</strong> Managed PostgreSQL with application-level encryption for sensitive fields.</li>
            <li><strong>6.5 Disclosures:</strong> Legal, security, and valid regulatory compliance. Affynelabs does not sell personal data.</li>
          </ul>
        </div>

        <div>
          <h4 className={headingClass}>7. Personalization vs. AI Training</h4>
          <p>
            Account and conversation data, personalization memory data, and AI training data are distinct. Processing a message to respond does not authorize using it for training.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>8. Memory, summaries, and inferred information</h4>
          <p>
            Derived memory records support continuity. Users have deletion rights subject to verified technical deletion workflows.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>9. Security and protection of personal data</h4>
          <p>
            Affynelabs implements technical and organizational safeguards including AES-256-GCM application encryption, transit encryption, and restricted access.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>10. International processing and data locations</h4>
          <p>
            Processing infrastructure involves India and the United States, governed by standard contractual safeguards and legal protections.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>11. Data retention</h4>
          <p>
            Data is retained only as long as necessary for the operational purpose and legal compliance.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>12. Your privacy choices and rights</h4>
          <p>
            Rights to access, correction, erasure, and consent withdrawal are supported via our designated privacy contact.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>13. Account closure and deletion</h4>
          <p>
            Users may request full account closure and deletion of conversation records and associated identifiers.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>14. Cookies and local storage</h4>
          <p>
            Essential cookies and local storage maintain authentication and session state without tracking cookies.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>15. Age restrictions</h4>
          <p>
            Mythri is strictly intended for individuals aged 18 and older.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>16. Automated processing and safety features</h4>
          <p>
            Automated crisis interception provides predetermined supportive resources; it is not continuous human emergency monitoring.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>17. Complaints and grievance handling</h4>
          <p>
            Grievances may be directed to our designated privacy officer at Affynelabs Private Limited.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>18. Changes to this Policy</h4>
          <p>
            Material updates will be notified in-app with effective revision dates.
          </p>
        </div>

        <div>
          <h4 className={headingClass}>19. Contact details</h4>
          <p>
            Operator: Affyne Labs Private Limited<br />
            Registered office: Indiranagar, Bengaluru, Karnataka 560038, India<br />
            Corporate Identity (CIN): U72900KA2026PTC184920<br />
            General support: support@affynelabs.com<br />
            Privacy &amp; grievance contact: Grievance Officer, privacy@affynelabs.com
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200/80 text-xs text-slate-500">
          <p className="font-semibold uppercase tracking-wider text-slate-700">
            Regulatory Compliance &amp; Verification
          </p>
          <p className="mt-1">
            Affyne Labs Private Limited adheres to deterministic clinical privacy invariants, DPDP Act 2023 principles, and zero-knowledge data egress standards.
          </p>
        </div>
      </div>
    );
  };

  // Ultra-slim, reduced bottom action bar (compact height)
  const renderActionFooter = () => (
    <div className="w-full">
      {!isAgreed ? (
        <button
          type="button"
          data-testid="agree-checkbox-button"
          disabled={!hasScrolledToBottom}
          onClick={() => {
            if (hasScrolledToBottom) setIsAgreed(true);
          }}
          className={`w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg border transition-colors text-left select-none text-xs ${
            !hasScrolledToBottom
              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-white border-slate-300 text-[#0C1A30] hover:border-slate-400 cursor-pointer shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                !hasScrolledToBottom
                  ? 'border-slate-300 bg-slate-50'
                  : isAgreed
                  ? 'bg-[#0C1A30] border-[#0C1A30] text-white'
                  : 'border-slate-400 bg-white'
              }`}
            >
              {isAgreed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span className="font-medium text-inherit">
              I agree to the Mythri Privacy Policy
            </span>
          </div>

          {!hasScrolledToBottom && (
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Scroll through to enable
            </span>
          )}
        </button>
      ) : (
        <div className="w-full">
          <WaitlistPillInput
            autoFocus
            placeholder="Enter your email"
            buttonText="Join Waitlist"
            onSuccess={(submittedEmail) => {
              if (onSuccess) onSuccess(submittedEmail);
            }}
          />
        </div>
      )}
    </div>
  );

  /* --------------------------------------------------------------------------
   * MODE 1: DESKTOP COMPACT SQUARE (When minimized on Desktop)
   * -------------------------------------------------------------------------- */
  if (!isMobile && !isMaximized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[480px] sm:max-w-[500px] lg:max-w-[520px] aspect-square rounded-2xl bg-white border border-slate-200 shadow-xl p-3.5 sm:p-4 flex flex-col overflow-hidden select-none z-30"
      >
        {/* Ultra-slim Top Bar with Maximize and Close */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-2.5 h-2.5" />
            </div>
            <span className="text-xs font-bold text-[#0C1A30] tracking-tight">
              Mythri Privacy Policy
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setIsMaximized(true)}
              className="p-1 rounded text-slate-400 hover:text-[#0C1A30] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Maximize to full screen"
              title="Maximize to full screen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="Close"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Compact Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 my-2 overflow-y-auto text-[11px] text-[#475569] leading-[1.6] select-text"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#E2E8F0 transparent', paddingRight: '6px' }}
        >
          {renderPolicyContent(true)}
        </div>

        {/* Ultra-slim Bottom Bar */}
        <div className="pt-2 border-t border-slate-100 shrink-0">
          {renderActionFooter()}
        </div>
      </motion.div>
    );
  }

  /* --------------------------------------------------------------------------
   * MODE 2: FULL SCREEN VIEW (Default on Desktop & Always on Mobile)
   * -------------------------------------------------------------------------- */
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: isMobile ? '100%' : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isMobile ? '100%' : 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] w-full h-[100dvh] bg-white flex flex-col overflow-hidden select-none"
      >
        {/* Ultra-slim Top Bar (Minimal height, no pill, window controls) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-1.5 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#1D4E89]/10 text-[#1D4E89] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3 h-3" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#0C1A30] tracking-tight">
              Mythri Privacy Policy
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Minimize Option */}
            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsMaximized(false)}
                className="p-1 rounded text-slate-400 hover:text-[#0C1A30] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Minimize to side window"
                aria-label="Minimize to side window"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Full Screen Scrollable Editorial Document */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-14 py-4 sm:py-6 text-xs sm:text-[14px] text-[#334155] leading-relaxed sm:leading-[1.75] select-text"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
        >
          <div className="max-w-3xl mx-auto">
            {renderPolicyContent(false)}
          </div>
        </div>

        {/* Ultra-slim Bottom Bar (Reduced height) */}
        <div className="px-4 sm:px-6 py-1.5 border-t border-slate-100 bg-white shrink-0">
          <div className="max-w-xl mx-auto w-full">
            {renderActionFooter()}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
