import Course from '../models/Course.js';
import Chapter from '../models/Chapter.js';
import Lecture from '../models/Lecture.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';
import { success, error, paginated } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cacheGet, cacheSet } from '../config/redis.js';

const slugify = (text) =>
  text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export const getCourses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, search, level, sort = '-createdAt', featured } = req.query;
  const filter = { isPublished: true, status: 'approved' };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$text = { $search: search };

  const cacheKey = `courses:${JSON.stringify(req.query)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return paginated(res, cached.data, cached.pagination);

  const skip = (Number(page) - 1) * Number(limit);
  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('educator', 'name avatar')
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Course.countDocuments(filter),
  ]);

  const pagination = { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) };
  await cacheSet(cacheKey, { data: courses, pagination }, 120);
  paginated(res, courses, pagination);
});

export const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
    .populate('educator', 'name avatar bio')
    .populate('category', 'name slug examType')
    .populate({ path: 'chapters', populate: { path: 'lectures' } });
  if (!course) return error(res, 'Course not found', 404);

  const reviews = await Review.find({ course: course._id, isApproved: true })
    .populate('user', 'name avatar')
    .limit(10)
    .sort('-createdAt');

  let enrollment = null;
  if (req.user) {
    enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
  }

  const related = await Course.find({
    category: course.category,
    _id: { $ne: course._id },
    isPublished: true,
  }).limit(4);

  success(res, { course, reviews, enrollment, related });
});

export const createCourse = asyncHandler(async (req, res) => {
  const slug = slugify(req.body.title) + '-' + Date.now().toString(36);
  const course = await Course.create({ ...req.body, slug, educator: req.user._id, status: 'pending' });
  success(res, { course }, 'Course created', 201);
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ _id: req.params.id, educator: req.user._id });
  if (!course && !['admin', 'super_admin', 'moderator'].includes(req.user.role)) {
    return error(res, 'Course not found', 404);
  }
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  success(res, { course: updated });
});

export const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return error(res, 'Course not found', 404);

  const existing = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (existing) return success(res, { enrollment: existing }, 'Already enrolled');

  const enrollment = await Enrollment.create({ user: req.user._id, course: course._id });
  course.enrollmentCount += 1;
  await course.save();
  success(res, { enrollment }, 'Enrolled successfully', 201);
});

export const updateProgress = asyncHandler(async (req, res) => {
  const { lectureId, watchedSeconds, completed } = req.body;
  let enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
  if (!enrollment) return error(res, 'Not enrolled', 400);

  const idx = enrollment.progress.findIndex((p) => p.lecture.toString() === lectureId);
  if (idx >= 0) {
    enrollment.progress[idx].watchedSeconds = watchedSeconds;
    enrollment.progress[idx].completed = completed ?? enrollment.progress[idx].completed;
    enrollment.progress[idx].lastWatched = new Date();
  } else {
    enrollment.progress.push({ lecture: lectureId, watchedSeconds, completed: completed || false, lastWatched: new Date() });
  }
  enrollment.lastAccessedLecture = lectureId;

  const totalLectures = await Lecture.countDocuments({ course: req.params.id });
  const completedCount = enrollment.progress.filter((p) => p.completed).length;
  enrollment.completionPercentage = totalLectures ? Math.round((completedCount / totalLectures) * 100) : 0;
  if (enrollment.completionPercentage >= 100) enrollment.completedAt = new Date();
  await enrollment.save();
  success(res, { enrollment });
});

export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate({ path: 'course', populate: [{ path: 'category', select: 'name slug' }, { path: 'educator', select: 'name avatar' }] })
    .sort('-updatedAt');
  success(res, { enrollments });
});
