import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { token, password } = await req.json();
    console.log('RESET API:', { token, password }); // Debug log
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }
    // Find user with valid token
    const user = await User.findOne({
      forgetPasswordToken: token,
      forgetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    // Update password
    user.password = await bcrypt.hash(password, 10);
    user.forgetPasswordToken = undefined;
    user.forgetPasswordTokenExpiry = undefined;
    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 