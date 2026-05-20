import Notification from '../models/Notification.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort('-createdAt').limit(50);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  success(res, { notifications, unreadCount });
});

export const markAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, _id: { $in: req.body.ids || [] } },
    { isRead: true }
  );
  success(res, null, 'Marked as read');
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  success(res, null, 'All marked as read');
});
