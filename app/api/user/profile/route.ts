import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById, getDepositsByUserId, getWithdrawalsByUserId, getReferralsByUserId, updateUser } from '@/lib/database';
import { updateUserROI } from '@/lib/roi';

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

    // Update ROI
    const deposits = getDepositsByUserId(user.id).filter(d => d.status === 'approved');
    const updatedROI = updateUserROI(user, deposits);
    
    if (updatedROI.balance !== user.balance) {
      updateUser(user.id, {
        balance: updatedROI.balance,
        lastROIUpdate: updatedROI.lastROIUpdate
      });
      user.balance = updatedROI.balance;
      user.lastROIUpdate = updatedROI.lastROIUpdate;
    }

    const withdrawals = getWithdrawalsByUserId(user.id);
    const referrals = getReferralsByUserId(user.id);

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      deposits,
      withdrawals,
      referrals,
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}