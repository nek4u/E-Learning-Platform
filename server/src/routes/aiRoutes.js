import { Router } from 'express';
import * as ai from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/chat', protect, ai.chat);
router.post('/study-planner', protect, ai.studyPlanner);
router.post('/summarize', protect, ai.summarizeLecture);
router.get('/recommendations', protect, ai.getRecommendations);
export default router;
