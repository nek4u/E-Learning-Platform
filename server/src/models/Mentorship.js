import mongoose from 'mongoose';

const mentorshipSchema = new mongoose.Schema(
  {
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    goals: [String],
    notes: String,
    meetingLink: String,
    amount: Number,
  },
  { timestamps: true }
);

export default mongoose.model('Mentorship', mentorshipSchema);
