import { Router } from 'express';
import * as student from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/dashboard', protect, authorize('student', 'educator', 'admin', 'super_admin'), student.getStudentDashboard);
export default router;
