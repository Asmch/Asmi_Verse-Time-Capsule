const { Resend } = require('resend');

// Use your actual API key here
const resend = new Resend('re_Q753fNK4_Kv3PjuajskJvA5wH5KTCTwkq');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'asmiversecapsule@gmail.com', // Replace with your email
  subject: 'Test Email from Resend',
  html: '<strong>This is a test email from Resend API</strong>',
}).then(console.log).catch(console.error);