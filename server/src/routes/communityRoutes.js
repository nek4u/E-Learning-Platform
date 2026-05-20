import { Router } from 'express';
import * as community from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', community.getPosts);
router.post('/', protect, community.createPost);
router.post('/:id/reply', protect, community.addReply);
router.post('/:id/like', protect, community.toggleLike);
export default router;
