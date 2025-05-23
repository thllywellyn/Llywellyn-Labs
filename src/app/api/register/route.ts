import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  let createdUser = null;
  let verificationToken = null;
  
  try {
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Check if there's an existing verification token and delete it
    await prisma.verificationToken.deleteMany({
      where: { email }
    });

    // Hash password and generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    try {
      // Create unverified user
      createdUser = await prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
          emailVerified: null,
          onboardingCompleted: false,
          role: "CLIENT"
        }
      });

      // Create verification token
      verificationToken = await prisma.verificationToken.create({
        data: {
          email,
          token: otp,
          expires: otpExpiry
        }
      });      // Send verification email
      await sendVerificationEmail(email, otp);
      console.log('[Registration] Verification email sent successfully to:', email);

      return NextResponse.json({
        email,
        requiresVerification: true,
        message: "Please verify your email address to complete registration"
      }, { status: 200 });
    } catch (error: any) {
      // If anything fails, clean up created records
      if (createdUser) {
        await prisma.user.delete({ where: { id: createdUser.id } });
      }
      await prisma.verificationToken.deleteMany({
        where: { email }
      });
      
      // Try to determine the specific error
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "This email is already registered." },
          { status: 400 }
        );
      }
      
      if (error.message?.includes('email')) {
        return NextResponse.json(
          { error: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error("[Registration] Error:", error);
    
    // Handle known error scenarios
    if (error.message?.includes('password')) {
      return NextResponse.json(
        { error: "Invalid password format. Password must be at least 8 characters long." },
        { status: 400 }
      );
    }
    
    // Generic error for unknown issues
    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
