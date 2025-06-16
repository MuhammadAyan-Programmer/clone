import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById, getWithdrawalsByUserId } from '@/lib/database';

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

    const withdrawals = getWithdrawalsByUserId(user.id);

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error('Withdrawals error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}