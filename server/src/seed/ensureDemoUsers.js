import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const DEMO_USERS = [
  {
    name: 'Demo Student',
    email: 'student@inacademy.com',
    password: 'Student@123',
    role: 'student',
    isEmailVerified: true,
    isActive: true,
    isApproved: true,
    xp: 1250,
    streak: 7,
  },
  {
    name: 'Platform Admin',
    email: 'admin@inacademy.com',
    password: 'Admin@123',
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
    isApproved: true,
  },
  {
    name: 'Super Admin',
    email: 'superadmin@inacademy.com',
    password: 'Admin@123',
    role: 'super_admin',
    isEmailVerified: true,
    isActive: true,
    isApproved: true,
  },
];

const ensureDemoUsers = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inacademy';
  await mongoose.connect(uri);
  console.log('MongoDB connected');

  for (const demo of DEMO_USERS) {
    let user = await User.findOne({ email: demo.email }).select('+password');
    if (user) {
      user.name = demo.name;
      user.password = demo.password;
      user.role = demo.role;
      user.isEmailVerified = demo.isEmailVerified;
      user.isActive = demo.isActive;
      user.isApproved = demo.isApproved;
      if (demo.xp !== undefined) user.xp = demo.xp;
      if (demo.streak !== undefined) user.streak = demo.streak;
      user.refreshTokens = [];
      await user.save();
      console.log(`Updated: ${demo.email} (${demo.role})`);
    } else {
      user = await User.create(demo);
      console.log(`Created: ${demo.email} (${demo.role})`);
    }
    const check = await User.findOne({ email: demo.email }).select('+password');
    const valid = await check.comparePassword(demo.password);
    if (!valid) throw new Error(`Password verification failed for ${demo.email}`);
  }

  console.log('\nDemo accounts ready:');
  console.log('  Student: student@inacademy.com / Student@123');
  console.log('  Admin:   admin@inacademy.com / Admin@123');
  await mongoose.disconnect();
  process.exit(0);
};

ensureDemoUsers().catch((e) => {
  console.error(e);
  process.exit(1);
});
