import { Router } from 'express';
import * as educator from '../controllers/educatorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/featured', educator.getFeaturedEducators);
router.get('/dashboard', protect, authorize('educator', 'admin', 'super_admin'), educator.getEducatorDashboard);
export default router;
