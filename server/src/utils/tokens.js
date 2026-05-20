import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });

export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateResetToken = () => crypto.randomBytes(32).toString('hex');

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');
