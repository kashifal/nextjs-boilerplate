import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { sendOTPEmail } from '@/lib/mail';
import Referral from '@/models/referral';
import jwt from 'jsonwebtoken';

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
    
    const { email, username, role, referralCode: referrerCode } = await req.json();

    // Validate input
    if (!email || !username) {
      return NextResponse.json(
        { error: 'Email and username are required' },
        { status: 400 }
      );
    }

    // Special handling for admin login - NO OTP NEEDED
    if (email === 'admin@example.com' && username === 'admin') {
      const adminUser = await User.findOne({ email });
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Invalid admin credentials' },
          { status: 401 }
        );
      }

      // Generate JWT token for admin
      const token = jwt.sign(
        { 
          userId: adminUser._id,
          role: adminUser.role,
          referralCode: adminUser.referralCode 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.json({
        message: 'Admin login successful',
        user: {
          id: adminUser._id,
          email: adminUser.email,
          role: adminUser.role,
          username: adminUser.username,
          referralCode: adminUser.referralCode,
          verified: true
        }
      });

      // Set auth token cookie
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    // For regular users - check if user exists
    const existingUser = await User.findOne({ email });
    let user;

    if (existingUser) {
      // Existing user - generate new OTP
      const otp = Math.floor(Math.random() * 9000 + 1000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      existingUser.otp = {
        code: otp,
        expiresAt: otpExpiry,
      };
      
      user = await existingUser.save();
    } else {
      // New user - create account
      let newReferralCode;
      let isUnique = false;
      while (!isUnique) {
        newReferralCode = generateReferralCode();
        const existing = await User.findOne({ referralCode: newReferralCode });
        if (!existing) {
          isUnique = true;
        }
      }

      const otp = Math.floor(Math.random() * 9000 + 1000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      user = await User.create({
        email,
        username,
        role: role || 'user',
        status: 'ACTIVE',
        referralCode: newReferralCode,
        otp: {
          code: otp,
          expiresAt: otpExpiry,
        }
      });

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
    }

    // Send OTP email for all regular users
    try {
      await sendOTPEmail(email, user.otp.code);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      if (!existingUser) {
        await User.findByIdAndDelete(user._id);
      }
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'OTP sent successfully',
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
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    );
  }
} 