import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { email }
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'No verification code found. Please sign up again.' },
        { status: 400 }
      );
    }

    // Check if the token has expired
    if (new Date() > verificationToken.expires) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { email }
      });
      return NextResponse.json(
        { error: 'Verification code has expired. Please sign up again.' },
        { status: 400 }
      );
    }

    // Verify the OTP
    if (verificationToken.token !== otp) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date()
      }
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { email }
    });

    return NextResponse.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
