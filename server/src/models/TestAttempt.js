import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionIndex: Number,
  selectedAnswer: Number,
  isCorrect: Boolean,
  marksObtained: Number,
});

const testAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [answerSchema],
    score: { type: Number, default: 0 },
    totalMarks: Number,
    percentage: Number,
    rank: Number,
    timeTaken: Number,
    startedAt: Date,
    submittedAt: Date,
    aiAnalysis: String,
  },
  { timestamps: true }
);

export default mongoose.model('TestAttempt', testAttemptSchema);
