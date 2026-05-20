import Quiz from '../models/Quiz.js';
import TestAttempt from '../models/TestAttempt.js';
import { success, error, paginated } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { aiPerformanceAnalysis } from '../services/aiService.js';

export const getQuizzes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, type } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const [quizzes, total] = await Promise.all([
    Quiz.find(filter).skip(skip).limit(Number(limit)).populate('category', 'name slug'),
    Quiz.countDocuments(filter),
  ]);
  paginated(res, quizzes, { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) });
});

export const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer -questions.explanation');
  if (!quiz) return error(res, 'Quiz not found', 404);
  success(res, { quiz });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return error(res, 'Quiz not found', 404);

  const { answers, timeTaken } = req.body;
  let score = 0;
  const graded = answers.map((a) => {
    const q = quiz.questions[a.questionIndex];
    const isCorrect = q && a.selectedAnswer === q.correctAnswer;
    let marks = 0;
    if (isCorrect) marks = q.marks || 1;
    else if (quiz.negativeMarking && a.selectedAnswer !== -1) marks = -(q.negativeMarks || 0);
    score += marks;
    return { ...a, isCorrect, marksObtained: marks };
  });

  const percentage = quiz.totalMarks ? (score / quiz.totalMarks) * 100 : 0;
  const aiAnalysis = await aiPerformanceAnalysis({ score, percentage, graded });

  const attempt = await TestAttempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers: graded,
    score,
    totalMarks: quiz.totalMarks,
    percentage,
    timeTaken,
    submittedAt: new Date(),
    aiAnalysis,
  });

  success(res, { attempt, solutions: quiz.questions }, 'Quiz submitted');
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const attempts = await TestAttempt.find({ quiz: req.params.id })
    .populate('user', 'name avatar')
    .sort('-score')
    .limit(50);
  success(res, { leaderboard: attempts });
});

export const createQuiz = asyncHandler(async (req, res) => {
  const totalMarks = req.body.questions?.reduce((s, q) => s + (q.marks || 1), 0) || 0;
  const quiz = await Quiz.create({ ...req.body, educator: req.user._id, totalMarks });
  success(res, { quiz }, 'Quiz created', 201);
});
