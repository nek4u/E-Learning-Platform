import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
  watchedSeconds: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastWatched: Date,
  notes: [{ timestamp: Number, text: String }],
});

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: [progressSchema],
    completionPercentage: { type: Number, default: 0 },
    lastAccessedLecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
    completedAt: Date,
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
