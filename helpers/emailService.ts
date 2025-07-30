import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing in environment variables!");
  throw new Error("RESEND_API_KEY is not set");
}
if (!process.env.DOMAIN) {
  console.error("❌ DOMAIN is missing in environment variables!");
  throw new Error("DOMAIN is not set");
}

console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    console.log("sendWelcomeEmail called for:", to, name);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Welcome to AsmiVerse!',
      html: `<strong>Hello ${name},</strong><br>Welcome to AsmiVerse! We're excited to have you.`,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
}

export async function sendCapsuleEmail(to: string, capsule: { title: string, message: string, unlockDate: Date }) {
  try {
    console.log("sendCapsuleEmail called for:", to, capsule);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: `Your Capsule "${capsule.title}" is Unlocked!`,
      html: `
      <h2>Your Capsule is Here!</h2>
      <p><strong>Title:</strong> ${capsule.title}</p>
      <p><strong>Message:</strong> ${capsule.message}</p>
      <p><strong>Unlocked At:</strong> ${new Date(capsule.unlockDate).toLocaleString()}</p>
      <br>
      <em>Thank you for using AsmiVerse!</em>
    `,
    });
  } catch (error) {
    console.error("Error sending capsule email:", error);
    throw new Error("Failed to send capsule email");
  }
}

export async function sendPasswordResetEmail(to: string, token: string) {
  try {
    console.log("sendPasswordResetEmail called for:", to, token);
    const resetUrl = `${process.env.DOMAIN}/reset-password?token=${token}`;
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Reset your AsmiVerse password',
      html: `
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
      <p>Or copy and paste this link in your browser:<br>${resetUrl}</p>
    `,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  try {
    console.log("sendVerificationEmail called for:", to, token);
    const verifyUrl = `${process.env.DOMAIN}/verifyemail?token=${token}`;
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject: 'Verify your AsmiVerse account',
      html: `
      <p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>
      <p>Or copy and paste this link in your browser:<br>${verifyUrl}</p>
    `,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
} 