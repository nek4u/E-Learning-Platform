import { Router } from 'express';
import * as search from '../controllers/searchController.js';

const router = Router();
router.get('/', search.globalSearch);
router.get('/trending', search.getTrending);
export default router;
