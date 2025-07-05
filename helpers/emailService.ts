import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

interface EmailData {
  email: string;
  emailType: 'VERIFY' | 'RESET' | 'CAPSULE_UNLOCKED' | 'WELCOME';
  userId?: string;
  capsuleData?: any;
  userName?: string;
  token?: string;
}

export const sendEmail = async ({ email, emailType, userId, capsuleData, userName, token }: EmailData) => {
  try {
    let hashedToken = '';
    if (userId && emailType === "VERIFY") {
      hashedToken = await bcrypt.hash(userId.toString(), 10);
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000
      });
    }
    const baseUrl = process.env.DOMAIN || 'http://localhost:3000';
    let subject = '';
    let html = '';
    if (emailType === 'VERIFY') {
      subject = 'Verify your AsmiVerse account';
      html = `<p>Click <a href="${baseUrl}/verifyemail?token=${hashedToken}">here</a> to verify your email.<br>${baseUrl}/verifyemail?token=${hashedToken}</p>`;
    } else if (emailType === 'RESET') {
      subject = 'Reset your AsmiVerse password';
      html = `<p>Click <a href="${baseUrl}/reset-password?token=${token}">here</a> to reset your password.<br>${baseUrl}/reset-password?token=${token}</p>`;
    } else if (emailType === 'CAPSULE_UNLOCKED') {
      subject = `Your Time Capsule "${capsuleData?.title}" is Ready!`;
      html = `<p>Your time capsule <b>${capsuleData?.title}</b> is unlocked!<br>View it <a href="${baseUrl}/view-capsule/${capsuleData?._id}">here</a>.</p>`;
    } else if (emailType === 'WELCOME') {
      subject = 'Welcome to AsmiVerse!';
      html = `<p>Welcome, ${userName || 'there'}! Start creating your first capsule <a href="${baseUrl}/Create">here</a>.</p>`;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Email Sending Error:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

export default sendEmail; 