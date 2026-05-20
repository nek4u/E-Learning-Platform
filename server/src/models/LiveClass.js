import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    educator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    scheduledAt: { type: Date, required: true },
    duration: Number,
    roomId: { type: String, unique: true },
    status: { type: String, enum: ['scheduled', 'live', 'ended', 'cancelled'], default: 'scheduled' },
    attendees: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, joinedAt: Date }],
    recordingUrl: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model('LiveClass', liveClassSchema);
