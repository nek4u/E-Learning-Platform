import { Router } from 'express';
import * as admin from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect, authorize('admin', 'super_admin', 'moderator'));

router.get('/dashboard', admin.getDashboardStats);
router.get('/users', admin.getUsers);
router.put('/users/:id', authorize('admin', 'super_admin'), admin.updateUser);
router.put('/courses/:id/moderate', admin.moderateCourse);
router.get('/banners', admin.getBanners);
router.post('/banners', admin.createBanner);
router.post('/notifications/broadcast', authorize('admin', 'super_admin'), admin.broadcastNotification);
router.get('/audit-logs', authorize('admin', 'super_admin'), admin.getAuditLogs);
export default router;
