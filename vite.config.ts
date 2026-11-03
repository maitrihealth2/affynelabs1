import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

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
  }
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

function apiPlugin(): Plugin {
  return {
    name: 'affyne-api-plugin',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Parse JSON body helper
        const parseBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        const sendJson = (statusCode: number, payload: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };

        // POST /api/waitlist
        if (req.url === '/api/waitlist' && req.method === 'POST') {
          parseBody().then((body) => {
            const { email } = body;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
              return sendJson(400, {
                success: false,
                error: 'Please provide a valid email address.',
              });
            }

            const normalizedEmail = email.trim().toLowerCase();
            const exists = waitlistStore.some((entry) => entry.email.toLowerCase() === normalizedEmail);
            if (exists) {
              return sendJson(409, {
                success: false,
                error: 'This email is already registered on our early access waiting list.',
              });
            }

            const newEntry = {
              id: 'wl-' + Math.random().toString(36).substring(2, 9),
              fullName: body.fullName?.trim() || 'Early Access Member',
              email: normalizedEmail,
              areaOfInterest: body.areaOfInterest?.trim() || 'General Early Access',
              createdAt: new Date().toISOString(),
            };

            waitlistStore.push(newEntry);

            return sendJson(201, {
              success: true,
              message: 'Thank you for joining the affyne labs early-access community.',
              position: waitlistStore.length,
            });
          });
          return;
        }

        // GET /api/waitlist/count
        if (req.url === '/api/waitlist/count' && req.method === 'GET') {
          return sendJson(200, {
            count: waitlistStore.length,
          });
        }

        // POST /api/contact
        if (req.url === '/api/contact' && req.method === 'POST') {
          parseBody().then((body) => {
            const { fullName, email, organization, subject, message, privacyAgreed } = body;

            if (!privacyAgreed) {
              return sendJson(400, {
                success: false,
                error: 'You must acknowledge the privacy policy before sending your message.',
              });
            }

            if (!fullName || fullName.trim().length < 2) {
              return sendJson(400, {
                success: false,
                error: 'Please enter your name.',
              });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email.trim())) {
              return sendJson(400, {
                success: false,
                error: 'Please provide a valid contact email.',
              });
            }

            if (!subject || subject.trim().length < 3) {
              return sendJson(400, {
                success: false,
                error: 'Please provide a subject line.',
              });
            }

            if (!message || message.trim().length < 10) {
              return sendJson(400, {
                success: false,
                error: 'Please write a message with at least 10 characters.',
              });
            }

            const contactEntry = {
              id: 'msg-' + Math.random().toString(36).substring(2, 9),
              fullName: fullName.trim(),
              email: email.trim().toLowerCase(),
              organization: organization?.trim() || undefined,
              subject: subject.trim(),
              message: message.trim(),
              createdAt: new Date().toISOString(),
            };

            contactStore.push(contactEntry);

            return sendJson(200, {
              success: true,
              message: 'Your inquiry has been received. Our team will respond shortly.',
            });
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true as true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
