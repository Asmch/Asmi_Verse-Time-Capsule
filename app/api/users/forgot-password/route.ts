import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import crypto from 'crypto';
import sendEmail from '@/helpers/emailService';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }
    // Generate a plain random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.forgetPasswordToken = resetToken;
    user.forgetPasswordTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();
    // Send reset email with the token
    await sendEmail({
      email,
      emailType: 'RESET',
      userId: user._id,
      token: resetToken,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
} 