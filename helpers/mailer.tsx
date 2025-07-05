import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcrypt from 'bcrypt';
import { TransportOptions } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async ({email, emailType, userId}: any) => {
   try {
       
       const hashedToken = await bcrypt.hash(userId.toString(), 10);
       
       if (emailType === "VERIFY") {
           await User.findByIdAndUpdate(userId, {
               verifyToken: hashedToken, 
               verifyTokenExpiry: Date.now() + 3600000
           });
       } else if (emailType === "RESET") {
           await User.findByIdAndUpdate(userId, {
               forgotPasswordToken: hashedToken, 
               forgotPasswordTokenExpiry: Date.now() + 3600000
           });
       }

       // Create transporter with error handling
       const transport = nodemailer.createTransport({
           host: process.env.SMTP_HOST,
           port: Number(process.env.SMTP_PORT),
           auth: {
               user: process.env.SMTP_USER,
               pass: process.env.SMTP_PASS,
           },
          //  secure: false, // Use this for Mailtrap
          //  requireTLS: true // Required for some SMTP servers
       } as TransportOptions);
       const mailOptions = {
           from: process.env.SMTP_USER, // Use SMTP user as sender
           to: email,
           subject: emailType === "VERIFY" 
               ? "Verify your email" 
               : "Reset your password",
           html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
           or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
           </p>`
       };

       // Send email with error handling
       const mailResponse = await transport.sendMail(mailOptions);
       return mailResponse;

   } catch (error: any) {
       console.error('Email Sending Error:', error);
       throw new Error(`Email sending failed: ${error.message}`);
   }
}