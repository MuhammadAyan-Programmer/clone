import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, verifyPassword } from '@/lib/auth';
import { getUserById, createWithdrawal, updateUser } from '@/lib/database';
import { sendWithdrawalNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
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

    const { amount, walletAddress, password } = await request.json();

    if (amount < 25) {
      return NextResponse.json({ success: false, message: 'Minimum withdrawal is $25' });
    }

    if (amount > user.balance) {
      return NextResponse.json({ success: false, message: 'Insufficient balance' });
    }

    if (!walletAddress) {
      return NextResponse.json({ success: false, message: 'Wallet address is required' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: 'Invalid password' });
    }

    // Create withdrawal
    const withdrawal = createWithdrawal({
      userId: user.id,
      amount,
      walletAddress,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // Deduct amount from user balance
    updateUser(user.id, {
      balance: user.balance - amount,
    });

    // Send email notification
    try {
      await sendWithdrawalNotification(user.email, amount, walletAddress);
    } catch (emailError) {
      console.error('Failed to send withdrawal notification:', emailError);
    }

    return NextResponse.json({
      success: true,
      withdrawal,
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}