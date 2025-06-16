import { NextResponse } from 'next/server';
import { getUsers, getDeposits, getWithdrawals, getReferrals, getUserById } from '@/lib/database';

export async function GET() {
  try {
    const users = getUsers();
    const deposits = getDeposits();
    const withdrawals = getWithdrawals();
    const referrals = getReferrals();

    // Add user email to deposits and withdrawals
    const depositsWithUserInfo = deposits.map(deposit => ({
      ...deposit,
      userEmail: getUserById(deposit.userId)?.email || 'Unknown'
    }));

    const withdrawalsWithUserInfo = withdrawals.map(withdrawal => ({
      ...withdrawal,
      userEmail: getUserById(withdrawal.userId)?.email || 'Unknown'
    }));

    const referralsWithUserInfo = referrals.map(referral => ({
      ...referral,
      referrerEmail: getUserById(referral.referrerId)?.email || 'Unknown',
      referredEmail: getUserById(referral.referredId)?.email || 'Unknown'
    }));

    const stats = {
      totalUsers: users.length,
      totalDeposits: deposits.filter(d => d.status === 'approved').reduce((sum, d) => sum + d.amount, 0),
      totalWithdrawals: withdrawals.filter(w => w.status === 'completed').reduce((sum, w) => sum + w.amount, 0),
      pendingDeposits: deposits.filter(d => d.status === 'pending').length,
      pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
    };

    return NextResponse.json({
      success: true,
      stats,
      users,
      deposits: depositsWithUserInfo.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      withdrawals: withdrawalsWithUserInfo.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      referrals: referralsWithUserInfo.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}