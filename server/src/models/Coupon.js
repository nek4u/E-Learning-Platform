import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountValue: { type: Number, required: true },
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    validFrom: Date,
    validUntil: Date,
    isActive: { type: Boolean, default: true },
    applicableTo: { type: String, enum: ['all', 'course', 'subscription'], default: 'all' },
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', couponSchema);
