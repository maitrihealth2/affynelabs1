import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Lock, Unlock } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsentConfirmed?: () => void;
  hasConsented?: boolean;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  onConsentConfirmed,
  hasConsented = false,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(hasConsented);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll detection when opening anew if not already consented
  useEffect(() => {
    if (isOpen && !hasConsented) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen, hasConsented]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el || hasScrolledToBottom) return;

    // Check if scrolled within 40px of bottom
    const threshold = 40;
    if (el.scrollHeight - el.scrollTop - el.clientHeight <= threshold) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0C1A30]/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FBFBFE]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#1A56DB]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="policy-modal-title" className="text-base font-bold text-[#0C1A30]">
                Affyne Labs · Privacy Policy
              </h3>
              <p className="text-xs text-[#64748B]">
                Official Data Governance &amp; Clinical Privacy Standard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6 text-xs sm:text-[13px] text-[#334155] leading-relaxed space-y-4 select-text"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent' }}
        >
          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 text-xs text-[#1D4E89] flex items-center gap-2.5">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              <strong>Transparency Guarantee:</strong> Please scroll through the official privacy governance documentation below.
            </span>
          </div>

          <div>
            <h4 className="font-bold text-[#0C1A30] text-sm mb-1">1. Introduction</h4>
            <p>
              This Privacy Policy explains how Affyne Labs Private Limited (&ldquo;Affynelabs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, stores, discloses, and otherwise processes personal data when you access or use Mythri and Affyne Labs services.
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
              <li><strong>Registered office:</strong> Indiranagar, Bengaluru, Karnataka 560038, India</li>
              <li><strong>Corporate Identity (CIN):</strong> U72900KA2026PTC184920</li>
              <li><strong>General support:</strong> support@affynelabs.com</li>
              <li><strong>Privacy and grievance contact:</strong> Grievance Officer, privacy@affynelabs.com</li>
              <li><strong>Effective date:</strong> November 4, 2026</li>
              <li><strong>Version:</strong> 1.0</li>
            </ul>
            <p className="mt-1">
              Affyne Labs Private Limited operates under applicable Indian and international data protection standards. Mythri is intended primarily for users in India, but users in other countries may also access it. Applicable privacy requirements and available rights depend on the circumstances and applicable privacy laws.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#0C1A30] text-sm mb-1">3. Categories of personal data we may process</h4>
            <div className="space-y-2 mt-1">
              <div>
                <span className="font-semibold text-[#0C1A30]">3.1 Account and authentication information:</span> Email address, internal account identifier, name or preferred name (if provided), authentication and account-status records necessary to maintain and secure your account.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.2 Onboarding and preference information:</span> Preferred name or language, goals, self-described stressors or areas of concern, relationship or personal context, and other onboarding summaries.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.3 Conversations and message history:</span> Submitted messages, generated AI responses, conversation history, timestamps, message identifiers, and recent message context.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.4 Personalization and memory data:</span> Preferences, recurring topics, goals, habits, extracted facts or memories, conversation summaries, and consolidated context.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.5 Journals, mood, and goals:</span> Journal entries, mood descriptions, ratings, tags, personal goals, progress, habit information, and reflection notes.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.6 Voice data:</span> Audio submitted for speech recognition, text transcripts, text for speech synthesis, generated audio responses, and technical processing metadata.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.7 Safety and security information:</span> Automated safety feature data including risk indicators, risk levels, and rule-matched phrases. Automated safety detection is not a professional clinical diagnosis.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.8 Technical and operational information:</span> IP addresses, browser/device information, user agents, session IDs, authentication events, audit records, and error telemetry.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.9 Browser and application storage:</span> Cookies, local storage, session storage, and service-worker caching supporting authentication, preferences, drafts, and offline resilience.
              </div>
              <div>
                <span className="font-semibold text-[#0C1A30]">3.10 Support and communications:</span> Email address, messages, attachments, and information needed to investigate or resolve support requests.
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
              Rights to access, correction, erasure, and consent withdrawal are supported via our designated privacy contact at privacy@affynelabs.com.
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
              Grievances may be directed to our designated grievance officer at Affyne Labs Private Limited via email at privacy@affynelabs.com.
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

        {/* Footer with Scroll Gate Feedback */}
        <div className="px-6 py-4 bg-[#FBFBFE] border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#202B38]/70">
            {hasScrolledToBottom ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4" /> Policy documentation reviewed
              </span>
            ) : (
              <span className="text-[#1A56DB] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                Scroll down to acknowledge
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-[#202B38]/80 hover:text-[#0C1A30] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              disabled={!hasScrolledToBottom}
              onClick={() => {
                onConsentConfirmed?.();
                onClose();
              }}
              className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                hasScrolledToBottom
                  ? 'bg-[#0C1A30] hover:bg-[#1A56DB] text-white shadow-sm active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              I Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
