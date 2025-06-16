import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUser, getDepositsByUserId } from '@/lib/database';
import { verifyPassword, generateToken } from '@/lib/auth';
import { updateUserROI } from '@/lib/roi';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const user = getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }

    // Update ROI before login
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

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}