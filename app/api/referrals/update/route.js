import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Referral from '@/models/referral';
import { verifyJWT } from '@/lib/jwt';

export async function PUT(request) {
  try {
    await connectDB();

    const { userId, stakeAmount } = await request.json();

    // Find referral where this user is the referred user
    const referral = await Referral.findOne({ referred: userId });
    
    if (!referral) {
      return NextResponse.json({ error: 'No referral found' }, { status: 404 });
    }

    // Calculate reward (5% of stake amount)
    const reward = (stakeAmount * 0);

    // Update referral status and amounts
    const updatedReferral = await Referral.findByIdAndUpdate(
      referral._id,
      {
        status: 'STAKED',
        stakeAmount: stakeAmount,
        reward: reward
      },
      { new: true }
    );

    return NextResponse.json({
      message: 'Referral updated successfully',
      referral: updatedReferral
    });

  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json(
      { error: 'Failed to update referral' },
      { status: 500 }
    );
  }
} 