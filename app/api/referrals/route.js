import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Referral from '@/models/referral';
import User from '@/models/user';
import { verifyJWT } from '@/lib/jwt';

export async function GET(request) {
  try {
    await connectDB();
    
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify and decode token
    const decoded = await verifyJWT(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find user and their referrals
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const referrals = await Referral.find({ referrer: decoded.userId })
      .populate('referred', 'email username')
      .sort({ createdAt: -1 })
      .lean();

    const stats = {
      totalReferrals: referrals.length,
      activeReferrals: referrals.filter(ref => ref.status === 'STAKED').length,
      totalRewards: referrals.reduce((sum, ref) => sum + (ref.reward || 0), 0),
      totalStaked: referrals.reduce((sum, ref) => sum + (ref.stakeAmount || 0), 0)
    };

    return NextResponse.json({ 
      referrals, 
      stats,
      referralCode: user.referralCode || '' 
    });

  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
} 