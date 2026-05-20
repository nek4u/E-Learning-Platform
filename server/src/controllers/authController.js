import User from '../models/User.js';
import Educator from '../models/Educator.js';
import AuditLog from '../models/AuditLog.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateOTP,
  generateResetToken,
  hashToken,
} from '../utils/tokens.js';
import { success, error } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const opts = { httpOnly: true, secure: isProd, sameSite: isProd ? 'strict' : 'lax', path: '/' };
  res.cookie('accessToken', accessToken, { ...opts, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...opts, maxAge: 7 * 24 * 60 * 60 * 1000 });
};

const saveRefreshToken = async (user, refreshToken, deviceId) => {
  user.refreshTokens = user.refreshTokens.filter((t) => t.expires > new Date());
  user.refreshTokens.push({
    token: hashToken(refreshToken),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceId: deviceId || 'unknown',
  });
  if (user.refreshTokens.length > 10) user.refreshTokens = user.refreshTokens.slice(-10);
  await user.save({ validateBeforeSave: false });
};

export const register = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.toLowerCase()?.trim();
  const { password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return error(res, 'Email already registered', 400);

  const otp = generateOTP();
  const user = await User.create({
    name: name || req.body.name,
    email,
    password,
    role: role === 'educator' ? 'educator' : 'student',
    isApproved: role !== 'educator',
    otp,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  if (user.role === 'educator') {
    await Educator.create({ user: user._id });
  }

  await sendVerificationEmail(user, otp);
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await saveRefreshToken(user, refreshToken, req.headers['x-device-id']);
  setTokenCookies(res, accessToken, refreshToken);

  success(res, { user: user.toPublicJSON(), accessToken, refreshToken }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.toLowerCase()?.trim();
  const { password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return error(res, 'Invalid credentials', 401);
  }
  if (!user.isActive) return error(res, 'Account deactivated', 403);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  await saveRefreshToken(user, refreshToken, req.headers['x-device-id']);
  setTokenCookies(res, accessToken, refreshToken);

  success(res, { user: user.toPublicJSON(), accessToken, refreshToken }, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id);
    const rt = req.cookies?.refreshToken;
    if (rt && user) {
      const hashed = hashToken(rt);
      user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashed);
      await user.save({ validateBeforeSave: false });
    }
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  success(res, null, 'Logged out');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) return error(res, 'Refresh token required', 401);

  const decoded = verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  const hashed = hashToken(token);
  const stored = user?.refreshTokens?.find((t) => t.token === hashed && t.expires > new Date());
  if (!stored) return error(res, 'Invalid refresh token', 401);

  const accessToken = generateAccessToken(user._id);
  const newRefresh = generateRefreshToken(user._id);
  user.refreshTokens = user.refreshTokens.filter((t) => t.token !== hashed);
  await saveRefreshToken(user, newRefresh, req.headers['x-device-id']);
  setTokenCookies(res, accessToken, newRefresh);

  success(res, { accessToken, refreshToken: newRefresh });
});

export const getMe = asyncHandler(async (req, res) => {
  success(res, { user: req.user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return success(res, null, 'If email exists, reset link sent');

  const resetToken = generateResetToken();
  user.resetPasswordToken = hashToken(resetToken);
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  await sendPasswordResetEmail(user, resetToken);
  success(res, null, 'If email exists, reset link sent');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashed = hashToken(req.body.token);
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password');
  if (!user) return error(res, 'Invalid or expired token', 400);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  success(res, null, 'Password reset successful');
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
  if (!user) return error(res, 'Invalid or expired OTP', 400);
  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  success(res, { user: user.toPublicJSON() }, 'Email verified');
});

export const resendOtp = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return error(res, 'User not found', 404);
  user.otp = generateOTP();
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save({ validateBeforeSave: false });
  await sendVerificationEmail(user, user.otp);
  success(res, null, 'OTP sent');
});
