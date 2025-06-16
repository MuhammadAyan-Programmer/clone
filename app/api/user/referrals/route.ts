import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById, getReferralsByUserId } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' });
    }

    const user = getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    const referrals = getReferralsByUserId(user.id);
    
    const stats = {
      directReferrals: referrals.filter(r => r.level === 1).length,
      indirectReferrals: referrals.filter(r => r.level === 2).length,
      totalCommissions: referrals.reduce((sum, r) => sum + r.commission, 0),
    };

    return NextResponse.json({
      success: true,
      referrals,
      stats,
    });
  } catch (error) {
    console.error('Referrals error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}