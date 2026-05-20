import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const createTransporter = () => {
  if (!process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  if (!transporter) {
    logger.debug(`Email skipped (no SMTP): ${subject} -> ${to}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@inacademy.com',
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your InAcademy account',
    html: `<p>Hi ${user.name},</p><p>Click <a href="${url}">here</a> to verify your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    html: `<p>Hi ${user.name},</p><p>Click <a href="${url}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  });
};
