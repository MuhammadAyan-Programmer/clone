import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById, getDepositsByUserId, updateUser } from '@/lib/database';
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
    }

    return NextResponse.json({
      success: true,
      balance: updatedROI.balance,
    });
  } catch (error) {
    console.error('Balance error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}