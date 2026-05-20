import Wishlist from '../models/Wishlist.js';
import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('courses');
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, courses: [] });
  success(res, { wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, courses: [] });
  const courseId = req.params.courseId;
  const idx = wishlist.courses.indexOf(courseId);
  if (idx >= 0) wishlist.courses.splice(idx, 1);
  else wishlist.courses.push(courseId);
  await wishlist.save();
  await wishlist.populate('courses');
  success(res, { wishlist });
});
