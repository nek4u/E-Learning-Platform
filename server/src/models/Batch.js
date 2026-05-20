import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    startDate: Date,
    endDate: Date,
    price: Number,
    maxStudents: Number,
    enrolledCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    thumbnail: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
