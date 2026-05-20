import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import LiveClass from '../models/LiveClass.js';
import Educator from '../models/Educator.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getEducatorDashboard = asyncHandler(async (req, res) => {
  const courses = await Course.find({ educator: req.user._id });
  const courseIds = courses.map((c) => c._id);
  const [enrollments, liveClasses, profile] = await Promise.all([
    Enrollment.countDocuments({ course: { $in: courseIds } }),
    LiveClass.find({ educator: req.user._id }).sort('scheduledAt').limit(5),
    Educator.findOne({ user: req.user._id }),
  ]);
  const revenue = courses.reduce((s, c) => s + (c.discountPrice || c.price) * c.enrollmentCount * 0.7, 0);
  success(res, {
    stats: { courses: courses.length, students: enrollments, revenue },
    courses,
    liveClasses,
    profile,
  });
});

export const getFeaturedEducators = asyncHandler(async (req, res) => {
  const educators = await Educator.find({ isVerified: true })
    .populate('user', 'name avatar bio')
    .sort('-rating')
    .limit(8);
  success(res, { educators });
});
