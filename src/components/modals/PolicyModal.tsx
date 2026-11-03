import React, { useState, useRef, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#102E57]/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DCEBFA] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F6FC] bg-[#F7F8FA]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#174B91]" />
            <div>
              <h3 id="policy-modal-title" className="text-base font-semibold text-[#102E57]">
                Privacy Architecture & Governance Terms
              </h3>
              <p className="text-xs text-[#202B38]/60">
                Zero-Egress Healthcare AI Standard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#AEBBC9] hover:text-[#102E57] hover:bg-[#DCEBFA]/40 transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6 text-sm text-[#202B38]/85 space-y-5 leading-relaxed"
        >
          <div className="bg-[#F0F6FC] p-4 rounded-xl border border-[#DCEBFA]/60 text-xs text-[#102E57]">
            <strong>Mandatory Review Requirement:</strong> To guarantee full transparency and patient protection, you must scroll through the governance documentation below before granting consent.
          </div>

          <section>
            <h4 className="font-semibold text-[#102E57] text-sm mb-1.5">
              1. Foundational Commitment: Privacy-First Healthcare AI
            </h4>
            <p>
              affynelabs is founded on the conviction that mental healthcare and human vulnerability must never be subjected to commercial monetization, behavioral advertising, or unsecured model retraining. Any early access research prototype developed by affynelabs operates under cryptographic zero-knowledge principles.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-[#102E57] text-sm mb-1.5">
              2. Data Egress & Telemetry Invariants
            </h4>
            <p>
              Our systems implement local cryptographic enclaves. No patient identifiable information (PII), clinical session audio, verbatim transcripts, or diagnostic notes are ever transmitted to third-party model providers, advertising exchanges, or unverified public cloud repositories.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-[#102E57] text-sm mb-1.5">
              3. Early-Access Waiting List Communications
            </h4>
            <p>
              By joining our waiting list or initiating a clinical dialogue, you authorize affynelabs to notify you solely regarding research milestones, technical papers, and closed invitation schedules. Your contact credentials will never be shared, leased, or cross-referenced.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-[#102E57] text-sm mb-1.5">
              4. Clinical Boundaries & Non-Commercial Safety
            </h4>
            <p>
              All technologies developed by affynelabs represent decision-support and assistive cognitive architectures. They are engineered to augment licensed medical practitioners and empower patient self-reflection under verified safety protocols.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-[#102E57] text-sm mb-1.5">
              5. Right to Erasure & Cryptographic Withdrawal
            </h4>
            <p>
              You maintain the absolute right to request permanent deletion of your waiting list registration or inquiry records at any time with immediate effect by contacting privacy@affynelabs.com.
            </p>
          </section>

          <div className="pt-4 border-t border-[#F0F6FC] text-xs text-[#AEBBC9]">
            Last updated: November 2026, affynelabs Data Protection Officer
          </div>
        </div>

        {/* Footer with Scroll Gate Feedback */}
        <div className="px-6 py-4 bg-[#F7F8FA] border-t border-[#F0F6FC] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#202B38]/70">
            {hasScrolledToBottom ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4" /> Documentation reviewed
              </span>
            ) : (
              <span className="text-[#174B91]">
                Scroll down to unlock confirmation
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-[#202B38]/80 hover:text-[#102E57] rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              disabled={!hasScrolledToBottom}
              onClick={() => {
                onConsentConfirmed?.();
                onClose();
              }}
              className={`flex-1 sm:flex-initial px-5 py-2 text-xs font-medium rounded-lg transition-all ${
                hasScrolledToBottom
                  ? 'bg-[#174B91] hover:bg-[#102E57] text-white shadow-sm'
                  : 'bg-[#AEBBC9]/30 text-[#AEBBC9] cursor-not-allowed'
              }`}
            >
              I Acknowledge & Consent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
