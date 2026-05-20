import { Router } from 'express';
import * as course from '../controllers/courseController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, course.getCourses);
router.get('/my/enrollments', protect, course.getMyEnrollments);
router.get('/:slug', optionalAuth, course.getCourseBySlug);
router.post('/', protect, authorize('educator', 'admin', 'super_admin'), course.createCourse);
router.put('/:id', protect, authorize('educator', 'admin', 'super_admin', 'moderator'), course.updateCourse);
router.post('/:id/enroll', protect, course.enrollCourse);
router.put('/:id/progress', protect, course.updateProgress);

export default router;
