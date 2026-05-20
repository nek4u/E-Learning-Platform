import mongoose from 'mongoose';

const educatorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    headline: String,
    expertise: [String],
    experience: Number,
    rating: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    totalCourses: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    socialLinks: {
      youtube: String,
      twitter: String,
      linkedin: String,
      website: String,
    },
    availability: [{ day: String, slots: [String] }],
  },
  { timestamps: true }
);

export default mongoose.model('Educator', educatorSchema);
