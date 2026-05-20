import { verifyAccessToken } from '../utils/tokens.js';
import User from '../models/User.js';
import { error } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (!token) return error(res, 'Not authorized', 401);

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password -refreshTokens');
    if (!user || !user.isActive) return error(res, 'User not found or inactive', 401);

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return error(res, 'Not authorized for this action', 403);
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch {
    /* optional */
  }
  next();
};
