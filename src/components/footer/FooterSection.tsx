import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Linkedin, Twitter, Github, Mail } from 'lucide-react';
import { PolicyModal } from '../modals/PolicyModal';
import ClothText from './ClothText';
import type { SectionId } from '../../types';

interface FooterSectionProps {
  onNavigate: (sectionId: SectionId) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onNavigate }) => {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <footer
      id="footer"
      className="relative w-full min-h-screen lg:h-screen lg:max-h-screen px-6 sm:px-12 lg:px-20 pt-12 sm:pt-16 lg:pt-20 pb-4 sm:pb-6 bg-white flex flex-col justify-between overflow-x-hidden overflow-hidden select-none"
    >
      {/* 
        Top Directory Grid:
        Left Column: Brand Identity, Compliance Certifications, Socials & Registered Entity
        Right 5 Columns: Clear, structured categorized site directory
      */}
      <div className="relative z-10 max-w-7xl mx-auto w-full py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Brand, Certifications & Corporate Address */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                affynelabs
              </h3>
              <p className="text-xs text-[#64748B] mt-1 font-medium">
                Healthcare & intelligence for humanity
              </p>
            </div>

            {/* Social Links: Individual clean format */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block mb-2">
                Find us at
              </span>
              <div className="flex items-center gap-4 text-[#475569]">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="hover:text-[#174B91] transition-colors cursor-pointer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="hover:text-[#174B91] transition-colors cursor-pointer"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="hover:text-[#174B91] transition-colors cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:contact@affynelabs.com"
                  aria-label="Email"
                  className="hover:text-[#174B91] transition-colors cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Registered Entity Info: Individual clean format without box container */}
            <div className="pt-2 text-[11px] text-[#64748B] leading-relaxed max-w-sm space-y-1">
              <p className="font-semibold text-[#0F172A]">
                © {new Date().getFullYear()} Affyne Labs Private Limited. All rights reserved.
              </p>
              <p>Indiranagar, Bengaluru, Karnataka 560038, India</p>
              <p className="text-[10px] text-[#94A3B8]">
                CIN: U72900KA2026PTC184920
              </p>
            </div>
          </div>

          {/* Right 5 Directory Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-xs">
            {/* Column 1: Products */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
                Products
              </span>
              <ul className="space-y-2 text-[#475569]">
                <li>
                  <button
                    onClick={() => onNavigate('mythri')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Mythri Assistant
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('what-we-do')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Clinical Enclaves
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('what-we-do')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Zero-Egress Vault
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('what-we-do')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Safety Guardrails
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Disciplines */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
                Disciplines
              </span>
              <ul className="space-y-2 text-[#475569]">
                <li>
                  <button
                    onClick={() => onNavigate('what-we-do')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Human-Centered
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('what-we-do')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Privacy Systems
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('what-we-do')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Responsible AI
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('what-we-do')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Accessible Safety
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Foundation */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
                Foundation
              </span>
              <ul className="space-y-2 text-[#475569]">
                <li>
                  <button
                    onClick={() => onNavigate('foundation')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Our Philosophy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('foundation')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Core Purpose
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('foundation')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Long-Term Vision
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('foundation')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Clinical Mission
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
                Company
              </span>
              <ul className="space-y-2 text-[#475569]">
                <li>
                  <button
                    onClick={() => onNavigate('who-we-are')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Who We Are
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Bengaluru Lab
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Clinical Advisory
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Partnerships
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Legal */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] block">
                Legal
              </span>
              <ul className="space-y-2 text-[#475569]">
                <li>
                  <button
                    onClick={() => setIsPolicyOpen(true)}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Trust Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPolicyOpen(true)}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPolicyOpen(true)}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsPolicyOpen(true)}
                    className="hover:text-[#174B91] transition-colors cursor-pointer text-left"
                  >
                    EULA & Ethics
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Bottom Monumental Wordmark:
        Interactive WebGL Silk-Cloth Text (ClothText) with ripples, folding physics & cursor reaction
      */}
      <div className="relative w-full flex items-center justify-center pt-1 pb-4 sm:pb-3 overflow-hidden">
        <div className="relative z-10 w-full text-center">
          <ClothText
            text="affynelabs"
            colors={["#133D75", "#2469C2", "#5B9EEA"]}
            hotColor="#60CDFA"
            fontFamily="'Google Sans', 'Google Sans Text', 'Product Sans', sans-serif"
            fontWeight={900}
            fold={0.12}
            className="w-full flex items-center justify-center select-none"
          />
        </div>
      </div>

      <PolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </footer>
  );
};
