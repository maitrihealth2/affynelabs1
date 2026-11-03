export type SectionId = 'home' | 'who-we-are' | 'foundation' | 'what-we-do' | 'mythri' | 'contact';

export interface WaitlistFormData {
  email: string;
  fullName?: string;
  areaOfInterest?: string;
  consented?: boolean;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
  privacyAgreed: boolean;
}

export interface DevelopmentInitiative {
  id: string;
  phase: string;
  title: string;
  category: string;
  summary: string;
  technicalDetails: string[];
  status: 'In Active Clinical Research' | 'Safety Architecture Phase' | 'Core Protocol Development';
}
