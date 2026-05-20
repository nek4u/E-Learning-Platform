import { Router } from 'express';
import authRoutes from './authRoutes.js';
import courseRoutes from './courseRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import quizRoutes from './quizRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import aiRoutes from './aiRoutes.js';
import adminRoutes from './adminRoutes.js';
import liveRoutes from './liveRoutes.js';
import communityRoutes from './communityRoutes.js';
import searchRoutes from './searchRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import educatorRoutes from './educatorRoutes.js';
import studentRoutes from './studentRoutes.js';
import homeRoutes from './homeRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/courses', courseRoutes);
router.use('/categories', categoryRoutes);
router.use('/quizzes', quizRoutes);
router.use('/payments', paymentRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);
router.use('/live', liveRoutes);
router.use('/community', communityRoutes);
router.use('/search', searchRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/notifications', notificationRoutes);
router.use('/educator', educatorRoutes);
router.use('/student', studentRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'InAcademy API is running', timestamp: new Date().toISOString() });
});

export default router;
