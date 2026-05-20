import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const deviceSchema = new mongoose.Schema({
  deviceId: String,
  userAgent: String,
  ip: String,
  lastActive: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    avatar: { type: String, default: '' },
    role: {
      type: String,
      enum: ['student', 'educator', 'admin', 'super_admin', 'moderator'],
      default: 'student',
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    otp: String,
    otpExpires: Date,
    refreshTokens: [{ token: String, expires: Date, deviceId: String }],
    devices: [deviceSchema],
    googleId: String,
    githubId: String,
    bio: String,
    phone: String,
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastStudyDate: Date,
    badges: [String],
    achievements: [String],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    educatorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Educator' },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      notifications: { email: Boolean, push: Boolean, sms: Boolean },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.resetPasswordToken;
  delete obj.otp;
  return obj;
};

export default mongoose.model('User', userSchema);
