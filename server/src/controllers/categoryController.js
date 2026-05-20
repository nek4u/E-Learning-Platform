import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Batch from '../models/Batch.js';
import Quiz from '../models/Quiz.js';
import { success, error } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('order');
  success(res, { categories });
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) return error(res, 'Category not found', 404);

  const [courses, batches, quizzes] = await Promise.all([
    Course.find({ category: category._id, isPublished: true }).limit(12).populate('educator', 'name avatar'),
    Batch.find({ category: category._id }).limit(6),
    Quiz.find({ category: category._id, isPublished: true }).limit(6),
  ]);

  success(res, { category, courses, batches, quizzes });
});
