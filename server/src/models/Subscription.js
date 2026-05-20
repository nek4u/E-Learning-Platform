import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: String,
  slug: String,
  price: Number,
  yearlyPrice: Number,
  features: [String],
  trialDays: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plan: planSchema,
    status: { type: String, enum: ['active', 'cancelled', 'expired', 'trial'], default: 'trial' },
    startDate: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: true },
    provider: String,
    providerSubscriptionId: String,
  },
  { timestamps: true }
);

export default mongoose.model('Subscription', subscriptionSchema);
