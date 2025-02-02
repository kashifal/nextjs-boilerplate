import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Referral from '@/models/referral';
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
    if (!decoded || !decoded.userId || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all referrals with populated user data
    const referrals = await Referral.find()
      .populate('referrer', 'email username')
      .populate('referred', 'email username')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ referrals });

  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
} 