import { NextRequest, NextResponse } from 'next/server';
import { updateDeposit, getUserById, updateUser, getReferralsByUserId, getUserByReferralCode } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { depositId, action } = await request.json();

    if (!depositId || !action) {
      return NextResponse.json({ success: false, message: 'Missing required fields' });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    const deposit = updateDeposit(depositId, {
      status,
      approvedAt: action === 'approve' ? new Date().toISOString() : undefined,
    });

    if (!deposit) {
      return NextResponse.json({ success: false, message: 'Deposit not found' });
    }

    // If approved, handle referral commissions and update user balance
    if (action === 'approve') {
      const user = getUserById(deposit.userId);
      if (user) {
        // Update user balance and total deposited
        updateUser(deposit.userId, {
          balance: user.balance + deposit.amount,
          totalDeposited: user.totalDeposited + deposit.amount,
        });

        // Handle referral commissions
        if (user.referredBy) {
          const referrer = getUserByReferralCode(user.referredBy);
          if (referrer) {
            // Direct referral commission (12%)
            const directCommission = deposit.amount * 0.12;
            updateUser(referrer.id, {
              balance: referrer.balance + directCommission,
            });

            // Update referral record
            const referrals = getReferralsByUserId(referrer.id);
            const referral = referrals.find(r => r.referredId === user.id && r.level === 1);
            if (referral) {
              // Note: We don't have updateReferral function, so commission tracking would need to be implemented
            }

            // Check for indirect referral
            if (referrer.referredBy) {
              const indirectReferrer = getUserByReferralCode(referrer.referredBy);
              if (indirectReferrer) {
                // Indirect referral commission (8%)
                const indirectCommission = deposit.amount * 0.08;
                updateUser(indirectReferrer.id, {
                  balance: indirectReferrer.balance + indirectCommission,
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      deposit,
    });
  } catch (error) {
    console.error('Admin deposit action error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}