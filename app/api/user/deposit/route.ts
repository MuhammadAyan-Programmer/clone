import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById, createDeposit } from '@/lib/database';
import { sendDepositNotification } from '@/lib/email';

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

    const { amount, txHash } = await request.json();

    if (amount < 50) {
      return NextResponse.json({ success: false, message: 'Minimum deposit is $50' });
    }

    if (!txHash) {
      return NextResponse.json({ success: false, message: 'Transaction hash is required' });
    }

    // Create deposit
    const deposit = createDeposit({
      userId: user.id,
      amount,
      status: 'pending',
      txHash,
      createdAt: new Date().toISOString(),
    });

    // Send email notification
    try {
      await sendDepositNotification(user.email, amount);
    } catch (emailError) {
      console.error('Failed to send deposit notification:', emailError);
    }

    return NextResponse.json({
      success: true,
      deposit,
    });
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}