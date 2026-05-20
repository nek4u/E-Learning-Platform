import { success } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { aiChat, aiStudyPlan, aiSummarize, aiRecommendations } from '../services/aiService.js';
import Enrollment from '../models/Enrollment.js';

export const chat = asyncHandler(async (req, res) => {
  const { message, context } = req.body;
  const response = await aiChat(message, context);
  success(res, { response });
});

export const studyPlanner = asyncHandler(async (req, res) => {
  const { goals, subjects } = req.body;
  const plan = await aiStudyPlan(goals, subjects);
  let parsed = plan;
  if (typeof plan === 'string') {
    try { parsed = JSON.parse(plan); } catch { parsed = { raw: plan }; }
  }
  success(res, { plan: parsed });
});

export const summarizeLecture = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const summary = await aiSummarize(content);
  success(res, { summary });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id }).populate('course');
  const recs = await aiRecommendations({ userId: req.user._id, enrollments });
  success(res, recs);
});
