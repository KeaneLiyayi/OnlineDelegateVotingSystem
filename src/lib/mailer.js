// lib/mailer.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(email, otp) {
  try {
    const response = await resend.emails.send({
      from: 'no-reply@onlinedelegatevotingsystem.xyz',
      to: email,
      subject: 'Your One-Time Password (OTP)',
      html: `
        <div style="font-family:sans-serif;line-height:1.5;">
          <h2>Login Verification</h2>
          <p>Your OTP is:</p>
          <p style="font-size: 24px; font-weight: bold;">${otp}</p>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    console.log('Email sent:', response);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Could not send OTP');
  }
}
export async function sendResultsEmail(recipients, electionName) {
  try {
    const response = await resend.emails.send({
      from: 'no-reply@onlinedelegatevotingsystem.xyz',
      to: recipients,
      subject: `Results are out for ${electionName}`,
      html: `
        <div style="font-family:sans-serif;line-height:1.5;">
          <h2>Election Results Ready</h2>
          <p>The results for <strong>${electionName}</strong> are now available.</p>
          <p>Log in to the voting portal to view them.</p>
        </div>
      `,
    });

    console.log('Results email sent:', response);
  } catch (error) {
    console.error('Failed to send results email:', error);
    throw new Error('Could not send results email');
  }
}

