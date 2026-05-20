import { Router } from 'express';
import * as quiz from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/', quiz.getQuizzes);
router.get('/:id/leaderboard', quiz.getLeaderboard);
router.get('/:id', protect, quiz.getQuizById);
router.post('/:id/submit', protect, quiz.submitQuiz);
router.post('/', protect, authorize('educator', 'admin', 'super_admin'), quiz.createQuiz);
export default router;
