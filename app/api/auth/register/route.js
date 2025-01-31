import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { sendOTPEmail } from '@/lib/mail';
import Referral from '@/models/referral';

// Function to generate a random referral code
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export async function POST(req) {
  try {
    await connectDB();
    
    const { email, username, status, role, referralCode: referrerCode } = await req.json();

    // Validate input
    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Generate a unique referral code
    let newReferralCode;
    let isUnique = false;
    while (!isUnique) {
      newReferralCode = generateReferralCode();
      const existing = await User.findOne({ referralCode: newReferralCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create new user with referral code
    const userData = {
      email,
      username,
      role: role || 'user',
      status: status || 'ACTIVE',
      referralCode: newReferralCode
    };

    // Generate OTP if not admin
    if (role !== 'admin') {
      const otp = Math.floor(Math.random() * 9000 + 1000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      userData.otp = {
        code: otp,
        expiresAt: otpExpiry,
      };
    }

    const user = await User.create(userData);

    // Handle referral if referrer code exists
    if (referrerCode) {
      const referrer = await User.findOne({ referralCode: referrerCode });
      if (referrer) {
        await Referral.create({
          referrer: referrer._id,
          referred: user._id,
          status: 'PENDING'
        });
      }
    }

    // Send OTP email if not admin
    if (role !== 'admin') {
      try {
        await sendOTPEmail(email, userData.otp.code);
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        await User.findByIdAndDelete(user._id);
        return NextResponse.json(
          { error: 'Failed to send verification email' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      message: 'Registration successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        username: user.username,
        referralCode: user.referralCode
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `This ${field} is already registered` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 