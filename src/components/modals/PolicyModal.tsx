import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Maximize2, Minimize2 } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsentConfirmed?: () => void;
  hasConsented?: boolean;
}

// ── Policy content sections ──────────────────────────────────────────────────
const SECTIONS = [
  {
    title: '1. Introduction',
    body: `This Privacy Policy explains how Affyne Labs Private Limited ("Affynelabs", "we", "us", or "our") collects, uses, stores, discloses, and otherwise processes personal data when you access or use Mythri and Affyne Labs services.

Mythri is an AI-powered emotional-wellness and psychoeducational companion. Depending on the features available, it may allow you to have conversations, express emotions, maintain journals, set goals, use voice features, and receive personalized responses.

We recognize that conversations involving emotions, relationships, personal experiences, and wellbeing can be highly private. This Policy explains the categories of information involved, the purposes for which it may be processed, the role of external providers, and the choices and rights available to users.

This Policy should be read together with the Mythri Terms & Conditions and any separate notices or consent requests presented for specific features.`,
  },
  {
    title: '2. Who operates Mythri?',
    body: `Mythri is operated by Affyne Labs Private Limited.

• Registered office: Indiranagar, Bengaluru, Karnataka 560038, India
• Corporate Identity (CIN): U72900KA2026PTC184920
• General support: support@affynelabs.com
• Privacy and grievance contact: Grievance Officer, privacy@affynelabs.com
• Effective date: November 4, 2026 — Version: 1.0

Affyne Labs Private Limited operates under applicable Indian and international data protection standards. Mythri is intended primarily for users in India, but users in other countries may also access it.`,
  },
  {
    title: '3. Categories of personal data we may process',
    body: `3.1 Account and authentication information: Email address, internal account identifier, name or preferred name (if provided), authentication and account-status records necessary to maintain and secure your account.

3.2 Onboarding and preference information: Preferred name or language, goals, self-described stressors or areas of concern, relationship or personal context, and other onboarding summaries.

3.3 Conversations and message history: Submitted messages, generated AI responses, conversation history, timestamps, message identifiers, and recent message context.

3.4 Personalization and memory data: Preferences, recurring topics, goals, habits, extracted facts or memories, conversation summaries, and consolidated context.

3.5 Journals, mood, and goals: Journal entries, mood descriptions, ratings, tags, personal goals, progress, habit information, and reflection notes.

3.6 Voice data: Audio submitted for speech recognition, text transcripts, text for speech synthesis, generated audio responses, and technical processing metadata.

3.7 Safety and security information: Automated safety feature data including risk indicators, risk levels, and rule-matched phrases. Automated safety detection is not a professional clinical diagnosis.

3.8 Technical and operational information: IP addresses, browser/device information, user agents, session IDs, authentication events, audit records, and error telemetry.

3.9 Browser and application storage: Cookies, local storage, session storage, and service-worker caching supporting authentication, preferences, drafts, and offline resilience.

3.10 Support and communications: Email address, messages, attachments, and information needed to investigate or resolve support requests.`,
  },
  {
    title: '4. How we use personal data',
    body: `Subject to applicable law: providing the service (4.1), personalization and continuity (4.2), journaling and wellbeing features (4.3), security and abuse prevention (4.4), troubleshooting and maintenance (4.5), support and communications (4.6), and legal obligations (4.7).

4.8 AI model development and training: The current production audit found no pipeline that uses live user conversations to train, fine-tune, or retrain Mythri's own models. Any future model training will require separate affirmative consent.`,
  },
  {
    title: '5. How AI processing works',
    body: `Mythri uses external AI services for certain features. Information sent is reasonably necessary for the requested function. AI processing can produce inaccurate interpretations or inferred summaries. Users should not treat a generated summary as a guaranteed verbatim record.`,
  },
  {
    title: '6. Third-party providers and disclosures',
    body: `6.1 Sarvam AI: Conversational AI and voice functions (speech recognition & synthesis).
6.2 NVIDIA NIM: Session summary and memory synthesis operations.
6.3 Firebase/Google: Authentication and identity management.
6.4 Database: Managed PostgreSQL with application-level encryption for sensitive fields.
6.5 Disclosures: Legal, security, and valid regulatory compliance. Affynelabs does not sell personal data.`,
  },
  {
    title: '7. Personalization vs. AI Training',
    body: `Account and conversation data, personalization memory data, and AI training data are distinct. Processing a message to respond does not authorize using it for training.`,
  },
  {
    title: '8. Memory, summaries, and inferred information',
    body: `Derived memory records support continuity. Users have deletion rights subject to verified technical deletion workflows.`,
  },
  {
    title: '9. Security and protection of personal data',
    body: `Affynelabs implements technical and organizational safeguards including AES-256-GCM application encryption, transit encryption, and restricted access.`,
  },
  {
    title: '10. International processing and data locations',
    body: `Processing infrastructure involves India and the United States, governed by standard contractual safeguards and legal protections.`,
  },
  {
    title: '11. Data retention',
    body: `Data is retained only as long as necessary for the operational purpose and legal compliance.`,
  },
  {
    title: '12. Your privacy choices and rights',
    body: `Rights to access, correction, erasure, and consent withdrawal are supported via our designated privacy contact at privacy@affynelabs.com.`,
  },
  {
    title: '13. Account closure and deletion',
    body: `Users may request full account closure and deletion of conversation records and associated identifiers.`,
  },
  {
    title: '14. Cookies and local storage',
    body: `Essential cookies and local storage maintain authentication and session state without tracking cookies.`,
  },
  {
    title: '15. Age restrictions',
    body: `Mythri is strictly intended for individuals aged 18 and older.`,
  },
  {
    title: '16. Automated processing and safety features',
    body: `Automated crisis interception provides predetermined supportive resources; it is not continuous human emergency monitoring.`,
  },
  {
    title: '17. Complaints and grievance handling',
    body: `Grievances may be directed to our designated grievance officer at Affyne Labs Private Limited via email at privacy@affynelabs.com.`,
  },
  {
    title: '18. Changes to this Policy',
    body: `Material updates will be notified in-app with effective revision dates.`,
  },
  {
    title: '19. Contact details',
    body: `Operator: Affyne Labs Private Limited
Registered office: Indiranagar, Bengaluru, Karnataka 560038, India
Corporate Identity (CIN): U72900KA2026PTC184920
General support: support@affynelabs.com
Privacy & grievance contact: Grievance Officer, privacy@affynelabs.com`,
  },
];

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  onConsentConfirmed,
  hasConsented = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setIsExpanded(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isExpanded) setIsExpanded(false);
        else onClose();
      }
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isExpanded, onClose]);

  if (!isOpen) return null;

  // ── On mobile: full-screen takeover ──────────────────────────────────────
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          key="policy-mobile"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Privacy Policy"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#FBFBFE] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#1A56DB]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0C1A30]">Privacy Policy</h2>
                <p className="text-[11px] text-[#64748B]">Affyne Labs · Official Data Governance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close Privacy Policy"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable body — full remaining height */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-6 space-y-6 text-sm text-[#334155] leading-relaxed"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
          >
            {SECTIONS.map((sec) => (
              <div key={sec.title} className="space-y-2">
                <h3 className="text-[13px] font-bold text-[#0C1A30]">{sec.title}</h3>
                <p className="whitespace-pre-line text-[#475569] text-[13px] leading-[1.7]">{sec.body}</p>
              </div>
            ))}

            {/* Compliance footer */}
            <div className="pt-4 border-t border-slate-200/60 text-[11px] text-[#94A3B8]">
              <p className="font-semibold uppercase tracking-wider text-[#64748B] mb-1">Regulatory Compliance</p>
              <p>Affyne Labs Private Limited adheres to deterministic clinical privacy invariants, DPDP Act 2023 principles, and zero-knowledge data egress standards.</p>
            </div>
          </div>

          {/* Footer action */}
          <div className="shrink-0 px-5 py-4 border-t border-slate-100 bg-[#FBFBFE]">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#0C1A30] text-white text-sm font-semibold hover:bg-[#1A56DB] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Desktop / Tablet: Side panel that can expand to full screen ──────────
  return (
    <AnimatePresence>
      <div
        key="policy-desktop-backdrop"
        className="fixed inset-0 z-[55] bg-[#0C1A30]/40 backdrop-blur-sm"
        onClick={() => { if (!isExpanded) onClose(); }}
        aria-hidden="true"
      />

      <motion.div
        key="policy-desktop-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Privacy Policy"
        initial={{ x: '100%', opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: isExpanded ? '100vw' : undefined,
          borderRadius: isExpanded ? '0px' : undefined,
        }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 right-0 bottom-0 z-[60] bg-white shadow-2xl flex flex-col overflow-hidden ${
          isExpanded
            ? 'left-0 w-full rounded-none'
            : 'w-[480px] xl:w-[560px] rounded-l-3xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FBFBFE] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0C1A30]">Privacy Policy</h2>
              <p className="text-xs text-[#64748B]">Official Data Governance &amp; Clinical Privacy Standard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Expand / collapse */}
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={isExpanded ? 'Collapse to panel' : 'Expand to full screen'}
              title={isExpanded ? 'Collapse to panel' : 'Expand to full screen'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Policy Body — no scroll gate, fully readable */}
        <div
          ref={scrollRef}
          className={`flex-1 overflow-y-auto text-[#334155] leading-relaxed space-y-5 select-text ${
            isExpanded
              ? 'px-10 xl:px-24 py-8 max-w-4xl mx-auto w-full text-base'
              : 'px-6 py-6 text-[13px]'
          }`}
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
        >
          {SECTIONS.map((sec) => (
            <div key={sec.title} className="space-y-2">
              <h3 className={`font-bold text-[#0C1A30] ${isExpanded ? 'text-base' : 'text-sm'}`}>
                {sec.title}
              </h3>
              <p
                className={`whitespace-pre-line text-[#475569] ${
                  isExpanded ? 'text-base leading-[1.75]' : 'text-[13px] leading-[1.7]'
                }`}
              >
                {sec.body}
              </p>
            </div>
          ))}

          {/* Compliance footer */}
          <div className="pt-4 border-t border-slate-200/60 text-[11px] text-[#94A3B8]">
            <p className="font-semibold uppercase tracking-wider text-[#64748B] mb-1">Regulatory Compliance</p>
            <p>Affyne Labs Private Limited adheres to deterministic clinical privacy invariants, DPDP Act 2023 principles, and zero-knowledge data egress standards.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-[#FBFBFE] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#94A3B8]">Version 1.0 · November 2026</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-medium text-[#0C1A30] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onConsentConfirmed && (
              <button
                onClick={() => { onConsentConfirmed(); onClose(); }}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-[#0C1A30] hover:bg-[#1A56DB] text-white transition-colors cursor-pointer"
              >
                I Acknowledge
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
