import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    order: { type: Number, default: 0 },
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    isFree: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Chapter', chapterSchema);
