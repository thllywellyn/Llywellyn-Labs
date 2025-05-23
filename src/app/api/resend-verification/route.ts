import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { generateOTP } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find existing user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Delete any existing verification tokens
    await prisma.verificationToken.deleteMany({
      where: { email }
    });

    // Generate new OTP and create verification token
    const otp = generateOTP();
    const token = await prisma.verificationToken.create({
      data: {
        email,
        token: otp,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    // Send verification email
    await sendVerificationEmail(email, otp);

    return NextResponse.json({ 
      message: "Verification code resent successfully" 
    });
  } catch (error) {
    console.error("Error resending verification code:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 }
    );
  }
}
