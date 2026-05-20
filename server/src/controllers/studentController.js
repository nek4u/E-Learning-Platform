import Enrollment from '../models/Enrollment.js';
import TestAttempt from '../models/TestAttempt.js';
import Certificate from '../models/Certificate.js';
import Notification from '../models/Notification.js';
import LiveClass from '../models/LiveClass.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const user = req.user;
  const [enrollments, attempts, certificates, notifications, upcomingLive] = await Promise.all([
    Enrollment.find({ user: user._id })
      .populate({ path: 'course', populate: { path: 'educator', select: 'name avatar' } })
      .sort('-updatedAt')
      .limit(6),
    TestAttempt.find({ user: user._id }).sort('-createdAt').limit(5).populate('quiz', 'title type'),
    Certificate.find({ user: user._id }).populate('course', 'title thumbnail'),
    Notification.find({ user: user._id, isRead: false }).limit(5),
    LiveClass.find({ scheduledAt: { $gte: new Date() }, status: 'scheduled' }).limit(3).populate('educator', 'name'),
  ]);

  const continueLearning = enrollments.filter((e) => e.completionPercentage < 100).slice(0, 4);

  success(res, {
    user: { xp: user.xp, streak: user.streak, badges: user.badges },
    continueLearning,
    enrollments,
    testAnalytics: attempts,
    certificates,
    notifications,
    upcomingLive,
  });
});
