import LiveClass from '../models/LiveClass.js';
import { v4 as uuidv4 } from 'uuid';
import { success, error } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getLiveClasses = asyncHandler(async (req, res) => {
  const filter = req.query.upcoming === 'true'
    ? { scheduledAt: { $gte: new Date() }, status: { $in: ['scheduled', 'live'] } }
    : {};
  const classes = await LiveClass.find(filter)
    .populate('educator', 'name avatar')
    .populate('course', 'title slug')
    .sort('scheduledAt')
    .limit(20);
  success(res, { liveClasses: classes });
});

export const createLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await LiveClass.create({
    ...req.body,
    educator: req.user._id,
    roomId: uuidv4(),
  });
  success(res, { liveClass }, 'Live class scheduled', 201);
});

export const joinLiveClass = asyncHandler(async (req, res) => {
  const liveClass = await LiveClass.findById(req.params.id);
  if (!liveClass) return error(res, 'Live class not found', 404);
  const exists = liveClass.attendees.find((a) => a.user.toString() === req.user._id.toString());
  if (!exists) {
    liveClass.attendees.push({ user: req.user._id, joinedAt: new Date() });
    await liveClass.save();
  }
  success(res, { liveClass, roomId: liveClass.roomId });
});
