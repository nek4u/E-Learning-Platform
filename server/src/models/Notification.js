import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: String,
    type: { type: String, enum: ['info', 'success', 'warning', 'course', 'payment', 'live', 'test', 'system'], default: 'info' },
    link: String,
    isRead: { type: Boolean, default: false },
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
