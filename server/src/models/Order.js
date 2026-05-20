import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
      type: { type: String, enum: ['course', 'subscription', 'batch'] },
      itemId: mongoose.Schema.Types.ObjectId,
      title: String,
      price: Number,
    }],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    status: { type: String, enum: ['pending', 'completed', 'cancelled', 'refunded'], default: 'pending' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
