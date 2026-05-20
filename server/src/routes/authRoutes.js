import { Router } from 'express';
import * as auth from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validate(registerSchema), auth.register);
router.post('/login', validate(loginSchema), auth.login);
router.post('/logout', protect, auth.logout);
router.post('/refresh', auth.refreshToken);
router.get('/me', protect, auth.getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), auth.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), auth.resetPassword);
router.post('/verify-otp', validate(verifyOtpSchema), auth.verifyOtp);
router.post('/resend-otp', auth.resendOtp);

export default router;
