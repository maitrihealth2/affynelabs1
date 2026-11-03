import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store for submissions
const waitlistStore: Array<{
  id: string;
  fullName: string;
  email: string;
  areaOfInterest?: string;
  createdAt: string;
}> = [
  {
    id: 'seed-1',
    fullName: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@stanfordmed.org',
    areaOfInterest: 'Clinical Validation & Psychiatry',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'seed-2',
    fullName: 'Marcus Lindqvist',
    email: 'm.lindqvist@karolinska.se',
    areaOfInterest: 'Privacy-First Architecture',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const contactStore: Array<{
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
  createdAt: string;
}> = [];

// POST /api/waitlist
app.post('/api/waitlist', (req: Request, res: Response) => {
  const { email, fullName, areaOfInterest } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid email address.',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = waitlistStore.some((entry) => entry.email.toLowerCase() === normalizedEmail);
  if (exists) {
    return res.status(409).json({
      success: false,
      error: 'This email is already registered on our early access waiting list.',
    });
  }

  const newEntry = {
    id: 'wl-' + Math.random().toString(36).substring(2, 9),
    fullName: typeof fullName === 'string' && fullName.trim() ? fullName.trim() : 'Early Access Member',
    email: normalizedEmail,
    areaOfInterest: typeof areaOfInterest === 'string' ? areaOfInterest.trim() : 'General Early Access',
    createdAt: new Date().toISOString(),
  };

  waitlistStore.push(newEntry);

  return res.status(201).json({
    success: true,
    message: 'Thank you for joining the affyne labs early-access community.',
    position: waitlistStore.length,
  });
});

// GET /api/waitlist/count
app.get('/api/waitlist/count', (_req: Request, res: Response) => {
  return res.json({ count: waitlistStore.length });
});

// POST /api/contact
app.post('/api/contact', (req: Request, res: Response) => {
  const { fullName, email, organization, subject, message, privacyAgreed } = req.body;

  if (!privacyAgreed) {
    return res.status(400).json({
      success: false,
      error: 'You must acknowledge the privacy policy before sending your message.',
    });
  }

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    return res.status(400).json({
      success: false,
      error: 'Please enter your name.',
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid contact email.',
    });
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a subject line.',
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({
      success: false,
      error: 'Please write a message with at least 10 characters.',
    });
  }

  const contactEntry = {
    id: 'msg-' + Math.random().toString(36).substring(2, 9),
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    organization: typeof organization === 'string' ? organization.trim() : undefined,
    subject: subject.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  contactStore.push(contactEntry);

  return res.json({
    success: true,
    message: 'Your inquiry has been received. Our team will respond shortly.',
  });
});

// Serve static frontend assets from dist in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`affyne labs server running on port ${PORT}`);
});
