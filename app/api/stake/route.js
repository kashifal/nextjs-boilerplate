import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Stake from '@/models/staking';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request) {
  try {
    await connectDB();
    
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    const { amount, currency } = await request.json();

    // Create stake
    const stake = await Stake.create({
      userId: decoded.userId,
      amount,
      currency
    });

    // Update referral if exists
    await fetch(`${process.env.NEXTAUTH_URL}/api/referrals/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: decoded.userId,
        stakeAmount: amount
      })
    });

    return NextResponse.json({
      message: 'Stake created successfully',
      stake
    });

  } catch (error) {
    console.error('Staking error:', error);
    return NextResponse.json(
      { error: 'Failed to create stake' },
      { status: 500 }
    );
  }
} 