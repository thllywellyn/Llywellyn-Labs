import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Simple in-memory rate limiter. NOTE: This is per-process only and
// not suitable for horizontally scaled or serverless deployments.
type RateEntry = { count: number; first: number };
const RATE_LIMIT_MAP = new Map<string, RateEntry>();
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 5; // max submissions per IP per window

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message, cf_turnstile_token, website } = body;

    // Honeypot check - if this field is filled out, it's likely a bot
    if (website) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    // Basic rate limiting by IP (best-effort)
    const xf = request.headers.get('x-forwarded-for');
    const ip = xf ? xf.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const existing = RATE_LIMIT_MAP.get(ip);
    if (existing) {
      if (now - existing.first < RATE_WINDOW_MS) {
        if (existing.count >= RATE_MAX) {
          return NextResponse.json({ error: 'Too many requests, please try later' }, { status: 429 });
        }
        existing.count += 1;
      } else {
        RATE_LIMIT_MAP.set(ip, { count: 1, first: now });
      }
    } else {
      RATE_LIMIT_MAP.set(ip, { count: 1, first: now });
    }

    // Verify Cloudflare Turnstile token
    if (!cf_turnstile_token) {
      return NextResponse.json({ error: 'Missing verification token' }, { status: 400 });
    }

    const secret = process.env.CF_TURNSTILE_SECRET;
    if (!secret) {
      console.error('CF_TURNSTILE_SECRET not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: cf_turnstile_token, remoteip: ip }),
    });

    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) {
      console.warn('Turnstile verification failed', verifyJson);
      return NextResponse.json({ error: 'Failed anti-bot verification' }, { status: 403 });
    }

    // Combine first and last name
    const name = `${firstName} ${lastName}`.trim();

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'First name, last name, email and message are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Basic message length check
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json({ error: 'Message length invalid' }, { status: 400 });
    }

    // Email content for admin
    const adminMailOptions = {
      from: process.env.SMTP_USER,
      to: 'me@lsanalab.xyz', // Your business email
      replyTo: email,
      subject: `Contact Form: ${subject || 'New Message'}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || 'N/A'}
Message: ${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject || 'N/A'}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };    // Email content for sender
    const senderMailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Thank you for contacting Llywellyn Labs`,
      text: `
Dear ${name},

Thank you for reaching out to Llywellyn Labs. This email confirms that we have received your message:

Subject: ${subject || 'N/A'}
Message:
${message}

We will get back to you as soon as possible.

Best regards,
Llywellyn Labs Team
      `,
      html: `
<h3>Thank you for contacting Llywellyn Labs</h3>
<p>Dear ${name},</p>
<p>Thank you for reaching out to Llywellyn Labs. This email confirms that we have received your message:</p>
<div style="margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px;">
  <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
  <p><strong>Message:</strong></p>
  <p>${message.replace(/\n/g, '<br>')}</p>
</div>
<p>We will get back to you as soon as possible.</p>
<p>Best regards,<br>Llywellyn Labs Team</p>
      `,
    };    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(senderMailOptions)
    ]);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
