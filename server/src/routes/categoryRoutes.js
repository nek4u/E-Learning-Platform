import { Router } from 'express';
import * as category from '../controllers/categoryController.js';

const router = Router();
router.get('/', category.getCategories);
router.get('/:slug', category.getCategoryBySlug);
export default router;
