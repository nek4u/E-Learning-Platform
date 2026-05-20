import User from '../models/User.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';
import Banner from '../models/Banner.js';
import Notification from '../models/Notification.js';
import { success, error, paginated } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, courses, revenue, pendingCourses, educators] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments({ isPublished: true }),
    Payment.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Course.countDocuments({ status: 'pending' }),
    User.countDocuments({ role: 'educator' }),
  ]);
  success(res, {
    stats: {
      users,
      courses,
      revenue: revenue[0]?.total || 0,
      pendingCourses,
      educators,
    },
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).select('-password -refreshTokens').skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  paginated(res, users, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  await AuditLog.create({ user: req.user._id, action: 'user_update', resourceId: user._id, details: req.body });
  success(res, { user });
});

export const moderateCourse = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { status, isPublished: status === 'approved' },
    { new: true }
  );
  success(res, { course });
});

export const getBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find().sort('order');
  success(res, { banners });
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  success(res, { banner }, 'Banner created', 201);
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const { title, message, role } = req.body;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select('_id');
  const notifications = users.map((u) => ({
    user: u._id,
    title,
    message,
    type: 'system',
  }));
  await Notification.insertMany(notifications);
  success(res, { count: notifications.length }, 'Notifications sent');
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find().populate('user', 'name email').sort('-createdAt').limit(100);
  success(res, { logs });
});
