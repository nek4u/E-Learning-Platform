import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    provider: { type: String, enum: ['razorpay', 'stripe'], required: true },
    providerPaymentId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    invoiceNumber: String,
    gstAmount: Number,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
