import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: String,
  order: Number,
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: String,
    thumbnail: String,
    introVideo: String,
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, default: 0 },
    discountPrice: Number,
    isFree: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    language: { type: String, default: 'English' },
    duration: Number,
    tags: [String],
    sections: [sectionSchema],
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
    ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    enrollmentCount: { type: Number, default: 0 },
    requirements: [String],
    outcomes: [String],
    status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Course', courseSchema);
