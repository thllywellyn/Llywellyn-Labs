'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');

  useEffect(() => {
    // Load Cloudflare Turnstile script once
    if (typeof window !== 'undefined' && !(window as any).turnstile) {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);

      s.onload = () => {
        try {
          if (widgetRef.current && (window as any).turnstile) {
            (window as any).turnstile.render(widgetRef.current, {
              sitekey: process.env.NEXT_PUBLIC_CF_TURNSTILE_SITEKEY,
              callback: (token: string) => setTurnstileToken(token),
            });
          }
        } catch (e) {
          // ignore render errors
        }
      };
    } else {
      // If script already present, try to render immediately
      if (widgetRef.current && (window as any).turnstile) {
        try {
          (window as any).turnstile.render(widgetRef.current, {
            sitekey: process.env.NEXT_PUBLIC_CF_TURNSTILE_SITEKEY,
            callback: (token: string) => setTurnstileToken(token),
          });
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus({ type: null, message: '' });

    // Basic client-side validation for Turnstile token and honeypot
    if (honeypot) {
      setFormStatus({ type: 'error', message: 'Spam detected' });
      setIsLoading(false);
      return;
    }

    if (!turnstileToken) {
      setFormStatus({ type: 'error', message: 'Please complete the anti-bot check' });
      setIsLoading(false);
      return;
    }

    try {
      const payload = { ...formData, cf_turnstile_token: turnstileToken, website: honeypot };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setFormStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      setTurnstileToken(null);
      if ((window as any).turnstile && (window as any).turnstile.reset) {
        try {
          (window as any).turnstile.reset();
        } catch (e) {}
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: error instanceof Error ? error.message : 'Failed to send message' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {/* Honeypot field - invisible to humans but traps bots */}
      <div style={{ display: 'none' }} aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <div className="input-box">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          disabled={isLoading}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          disabled={isLoading}
        />
      </div>
      <div className="input-box">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={isLoading}
        />
      </div>
      <div className="input-box">
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          disabled={isLoading}
        />
      </div>
      <textarea
        name="message"
        cols={30}
        rows={10}
        placeholder="Your Message"
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        disabled={isLoading}
      ></textarea>

      {/* Cloudflare Turnstile widget container */}
      <div ref={widgetRef} style={{ margin: '16px 0' }} />
      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
      {formStatus.type && (
        <div
          className={`form-status ${
            formStatus.type === 'success' ? 'success' : 'error'
          }`}
        >
          {formStatus.message}
        </div>
      )}
    </form>
  );
}
