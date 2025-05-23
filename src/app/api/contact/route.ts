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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }    // Email content for admin
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
