// test-resend.ts
import { Resend } from 'resend';

const resend = new Resend('re_Q753fNK4_Kv3PjuajskJvA5wH5KTCTwkq');// Replace with your actual API key

async function sendTestEmail() {
  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'asmitachoudhary08@gmail.com', // Replace with your email
      subject: 'Test Email from Resend',
      html: '<strong>This is a test email from Resend API</strong>',
    });
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

sendTestEmail();