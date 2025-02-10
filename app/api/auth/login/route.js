import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/user';
import { sendOTPEmail } from '@/lib/mail';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectDB();
    
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Special handling for admin login
    if (email === 'admin@stakeprofitx.com') {
      const adminUser = await User.findOne({ email });
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Invalid admin credentials' },
          { status: 401 }
        );
      }

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
          verified: true
        }
      });

      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
      });

      return response;
    }

    // For regular users
    let user = await User.findOne({ email });

    // Generate new OTP
    const otp = Math.floor(Math.random() * 9000 + 1000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email,
        status: 'ACTIVE',
        otp: {
          code: otp,
          expiresAt: otpExpiry,
        }
      });
    } else {
      // Update existing user's OTP
      user.otp = {
        code: otp,
        expiresAt: otpExpiry,
      };
      await user.save();
    }

    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'OTP sent successfully',
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    );
  }
} 