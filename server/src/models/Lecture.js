import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
    title: { type: String, required: true },
    description: String,
    videoUrl: String,
    videoDuration: Number,
    qualities: [{ label: String, url: String }],
    notes: String,
    pdfUrl: String,
    order: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
    aiSummary: String,
    captions: [{ language: String, url: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Lecture', lectureSchema);
