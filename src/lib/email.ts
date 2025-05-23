import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, otp: string) {
  console.log('[Email] Attempting to send verification email to:', email);
  
  try {
    // Verify the transporter connection
    await transporter.verify();
    console.log('[Email] SMTP connection verified');

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify your email address</h2>
          <p>Thank you for registering! Please use the following verification code to verify your email address:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
            <strong>${otp}</strong>
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email] Message sent successfully:', info.messageId);
    return info;
    
  } catch (error) {
    console.error('[Email] Failed to send verification email:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to send verification email');
  }
}
