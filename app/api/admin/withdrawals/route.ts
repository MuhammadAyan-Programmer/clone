import { NextRequest, NextResponse } from 'next/server';
import { updateWithdrawal, getUserById, updateUser } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { withdrawalId, action } = await request.json();

    if (!withdrawalId || !action) {
      return NextResponse.json({ success: false, message: 'Missing required fields' });
    }

    const status = action === 'complete' ? 'completed' : 'rejected';
    const withdrawal = updateWithdrawal(withdrawalId, {
      status,
      processedAt: new Date().toISOString(),
    });

    if (!withdrawal) {
      return NextResponse.json({ success: false, message: 'Withdrawal not found' });
    }

    // If rejected, add the amount back to user's balance
    if (action === 'reject') {
      const user = getUserById(withdrawal.userId);
      if (user) {
        updateUser(withdrawal.userId, {
          balance: user.balance + withdrawal.amount,
        });
      }
    } else if (action === 'complete') {
      // If completed, update user's total withdrawn
      const user = getUserById(withdrawal.userId);
      if (user) {
        updateUser(withdrawal.userId, {
          totalWithdrawn: user.totalWithdrawn + withdrawal.amount,
        });
      }
    }

    return NextResponse.json({
      success: true,
      withdrawal,
    });
  } catch (error) {
    console.error('Admin withdrawal action error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}