import { Router } from 'express';
import * as live from '../controllers/liveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/', live.getLiveClasses);
router.post('/', protect, authorize('educator', 'admin', 'super_admin'), live.createLiveClass);
router.post('/:id/join', protect, live.joinLiveClass);
export default router;
