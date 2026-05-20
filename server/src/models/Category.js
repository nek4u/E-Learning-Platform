import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    icon: String,
    image: String,
    examType: {
      type: String,
      enum: [
        'upsc', 'iit_jee', 'neet', 'gate', 'ssc', 'banking', 'cat', 'ca',
        'state_exams', 'coding', 'web_dev', 'data_science', 'general',
      ],
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    courseCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
