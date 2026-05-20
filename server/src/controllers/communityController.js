import Community from '../models/Community.js';
import { success, error, paginated } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, course } = req.query;
  const filter = {};
  if (course) filter.course = course;
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Community.find(filter).populate('author', 'name avatar role').sort('-createdAt').skip(skip).limit(Number(limit)),
    Community.countDocuments(filter),
  ]);
  paginated(res, posts, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await Community.create({ ...req.body, author: req.user._id });
  await post.populate('author', 'name avatar');
  success(res, { post }, 'Post created', 201);
});

export const addReply = asyncHandler(async (req, res) => {
  const post = await Community.findById(req.params.id);
  if (!post) return error(res, 'Post not found', 404);
  post.replies.push({ user: req.user._id, content: req.body.content });
  await post.save();
  success(res, { post });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Community.findById(req.params.id);
  if (!post) return error(res, 'Post not found', 404);
  const idx = post.likes.indexOf(req.user._id);
  if (idx >= 0) post.likes.splice(idx, 1);
  else post.likes.push(req.user._id);
  await post.save();
  success(res, { likes: post.likes.length });
});
