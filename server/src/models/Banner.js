import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    link: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    placement: { type: String, enum: ['hero', 'sidebar', 'popup'], default: 'hero' },
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);
