import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getUserByReferralCode, createUser, createReferral } from '@/lib/database';
import { hashPassword, generateToken, generateReferralCode } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, referralCode } = await request.json();

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique referral code
    let userReferralCode = generateReferralCode();
    while (getUserByReferralCode(userReferralCode)) {
      userReferralCode = generateReferralCode();
    }

    // Create user
    const newUser = createUser({
      email,
      password: hashedPassword,
      referralCode: userReferralCode,
      referredBy: referralCode || undefined,
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      lastROIUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // Handle referral if provided
    if (referralCode) {
      const referrer = getUserByReferralCode(referralCode);
      if (referrer) {
        // Create referral record for direct referral
        createReferral({
          referrerId: referrer.id,
          referredId: newUser.id,
          level: 1,
          commission: 0, // Commission will be added when user makes first deposit
          createdAt: new Date().toISOString(),
        });

        // Check for indirect referral (referrer's referrer)
        if (referrer.referredBy) {
          const indirectReferrer = getUserByReferralCode(referrer.referredBy);
          if (indirectReferrer) {
            createReferral({
              referrerId: indirectReferrer.id,
              referredId: newUser.id,
              level: 2,
              commission: 0,
              createdAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Generate JWT token
    const token = generateToken(newUser.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' });
  }
}