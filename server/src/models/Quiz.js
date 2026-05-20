import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  correctAnswer: Number,
  explanation: String,
  marks: { type: Number, default: 1 },
  negativeMarks: { type: Number, default: 0 },
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['quiz', 'mock', 'daily', 'topic', 'full_length', 'pyq'], default: 'quiz' },
    questions: [questionSchema],
    duration: Number,
    totalMarks: Number,
    negativeMarking: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', quizSchema);
