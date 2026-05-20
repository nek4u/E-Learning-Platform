import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    bookmarks: [{
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' },
      timestamp: Number,
    }],
  },
  { timestamps: true }
);

export default mongoose.model('Wishlist', wishlistSchema);
