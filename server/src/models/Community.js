import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

const communitySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: String,
    content: { type: String, required: true },
    type: { type: String, enum: ['discussion', 'announcement', 'doubt'], default: 'discussion' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [replySchema],
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Community', communitySchema);
