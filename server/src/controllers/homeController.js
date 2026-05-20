import Course from '../models/Course.js';
import Category from '../models/Category.js';
import Banner from '../models/Banner.js';
import Batch from '../models/Batch.js';
import LiveClass from '../models/LiveClass.js';
import User from '../models/User.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getHomeData = asyncHandler(async (req, res) => {
  const [banners, trendingCourses, categories, featuredBatches, liveClasses, educators, stats] = await Promise.all([
    Banner.find({ isActive: true, placement: 'hero' }).sort('order'),
    Course.find({ isPublished: true, isFeatured: true }).sort('-enrollmentCount').limit(8).populate('educator', 'name avatar').populate('category', 'name slug'),
    Category.find({ isActive: true }).sort('order').limit(12),
    Batch.find({ isFeatured: true }).limit(4).populate('educator', 'name avatar'),
    LiveClass.find({ status: { $in: ['scheduled', 'live'] }, scheduledAt: { $gte: new Date(Date.now() - 3600000) } }).limit(4).populate('educator', 'name avatar'),
    User.find({ role: 'educator', isApproved: true }).select('name avatar bio').limit(6),
    Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments({ isPublished: true }),
      User.countDocuments({ role: 'educator' }),
    ]),
  ]);

  success(res, {
    banners,
    trendingCourses,
    categories,
    featuredBatches,
    liveClasses,
    educators,
    statistics: {
      students: stats[0] + 50000,
      courses: stats[1] + 500,
      educators: stats[2] + 200,
      hoursWatched: '10M+',
    },
  });
});
