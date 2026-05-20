import Course from '../models/Course.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) return success(res, { courses: [], educators: [], categories: [] });

  const [courses, educators, categories] = await Promise.all([
    Course.find({ $text: { $search: q }, isPublished: true }).limit(10).populate('educator', 'name avatar'),
    User.find({ role: 'educator', $or: [{ name: new RegExp(q, 'i') }, { bio: new RegExp(q, 'i') }] }).limit(8).select('name avatar bio'),
    Category.find({ name: new RegExp(q, 'i'), isActive: true }).limit(5),
  ]);

  success(res, { courses, educators, categories, query: q });
});

export const getTrending = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true, isFeatured: true })
    .sort('-enrollmentCount')
    .limit(8)
    .populate('educator', 'name avatar');
  success(res, { trending: courses });
});
