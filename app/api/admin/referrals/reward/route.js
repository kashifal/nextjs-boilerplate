import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Referral from '@/models/referral';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request) {
  try {
    await connectDB();
    
    // Verify admin token
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referralId, rewardAmount } = await request.json();

    // Update referral reward
    const updatedReferral = await Referral.findByIdAndUpdate(
      referralId,
      { 
        reward: rewardAmount,
        status: 'REWARDED'
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Reward updated successfully',
      referral: updatedReferral
    });

  } catch (error) {
    console.error('Error updating reward:', error);
    return NextResponse.json(
      { error: 'Failed to update reward' },
      { status: 500 }
    );
  }
} 