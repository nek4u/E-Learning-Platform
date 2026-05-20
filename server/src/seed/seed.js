import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Educator from '../models/Educator.js';
import Category from '../models/Category.js';
import Course from '../models/Course.js';
import Chapter from '../models/Chapter.js';
import Lecture from '../models/Lecture.js';
import Quiz from '../models/Quiz.js';
import Banner from '../models/Banner.js';
import Batch from '../models/Batch.js';
import Coupon from '../models/Coupon.js';

const categories = [
  { name: 'UPSC', slug: 'upsc', examType: 'upsc', icon: '🏛️', order: 1 },
  { name: 'IIT JEE', slug: 'iit-jee', examType: 'iit_jee', icon: '🔬', order: 2 },
  { name: 'NEET', slug: 'neet', examType: 'neet', icon: '🩺', order: 3 },
  { name: 'GATE', slug: 'gate', examType: 'gate', icon: '⚙️', order: 4 },
  { name: 'SSC', slug: 'ssc', examType: 'ssc', icon: '📋', order: 5 },
  { name: 'Banking', slug: 'banking', examType: 'banking', icon: '🏦', order: 6 },
  { name: 'CAT', slug: 'cat', examType: 'cat', icon: '📊', order: 7 },
  { name: 'CA', slug: 'ca', examType: 'ca', icon: '💼', order: 8 },
  { name: 'State Exams', slug: 'state-exams', examType: 'state_exams', icon: '🗺️', order: 9 },
  { name: 'Coding', slug: 'coding', examType: 'coding', icon: '💻', order: 10 },
  { name: 'Web Development', slug: 'web-development', examType: 'web_dev', icon: '🌐', order: 11 },
  { name: 'Data Science', slug: 'data-science', examType: 'data_science', icon: '📈', order: 12 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inacademy');
  console.log('Connected. Seeding...');

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Course.deleteMany({}),
    Chapter.deleteMany({}),
    Lecture.deleteMany({}),
    Quiz.deleteMany({}),
    Banner.deleteMany({}),
    Batch.deleteMany({}),
    Educator.deleteMany({}),
    Coupon.deleteMany({}),
  ]);

  await User.create({
    name: 'Platform Admin',
    email: 'admin@inacademy.com',
    password: 'Admin@123',
    role: 'admin',
    isEmailVerified: true,
  });

  const educatorUser = await User.create({
    name: 'Dr. Rajesh Kumar',
    email: 'educator@inacademy.com',
    password: 'Educator@123',
    role: 'educator',
    isEmailVerified: true,
    bio: 'IIT alumnus with 15+ years teaching experience',
  });

  const student = await User.create({
    name: 'Demo Student',
    email: 'student@inacademy.com',
    password: 'Student@123',
    role: 'student',
    isEmailVerified: true,
    xp: 1250,
    streak: 7,
  });

  await Educator.create({
    user: educatorUser._id,
    headline: 'Expert Physics Educator',
    expertise: ['Physics', 'JEE', 'NEET'],
    experience: 15,
    rating: 4.9,
    totalStudents: 50000,
    isVerified: true,
  });

  const cats = await Category.insertMany(categories);

  await Banner.insertMany([
    { title: 'Master Your Dreams', subtitle: 'India\'s #1 Learning Platform', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200', placement: 'hero', order: 1 },
    { title: 'Live Classes Starting', subtitle: 'Join 10,000+ students today', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200', placement: 'hero', order: 2 },
  ]);

  await Coupon.create({ code: 'WELCOME50', discountType: 'percentage', discountValue: 50, maxUses: 1000, validUntil: new Date('2027-12-31') });

  const jeeCat = cats.find((c) => c.slug === 'iit-jee');
  const course = await Course.create({
    title: 'Complete Physics for JEE Main & Advanced',
    slug: 'complete-physics-jee',
    description: 'Comprehensive physics course covering all JEE topics with problem-solving strategies.',
    shortDescription: 'Master JEE Physics from basics to advanced',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600',
    educator: educatorUser._id,
    category: jeeCat._id,
    price: 4999,
    discountPrice: 2499,
    isFree: false,
    isPublished: true,
    isFeatured: true,
    status: 'approved',
    level: 'intermediate',
    tags: ['physics', 'jee', 'mechanics'],
    enrollmentCount: 12500,
    ratings: { average: 4.8, count: 3200 },
    outcomes: ['Solve JEE-level problems', 'Master all physics concepts'],
  });

  const ch1 = await Chapter.create({ course: course._id, title: 'Mechanics Fundamentals', order: 1, isFree: true });
  const ch2 = await Chapter.create({ course: course._id, title: 'Rotational Motion', order: 2 });

  const lectures = await Lecture.insertMany([
    { course: course._id, chapter: ch1._id, title: 'Introduction to Mechanics', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', videoDuration: 600, order: 1, isPreview: true },
    { course: course._id, chapter: ch1._id, title: "Newton's Laws of Motion", videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', videoDuration: 900, order: 2 },
    { course: course._id, chapter: ch2._id, title: 'Angular Momentum', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', videoDuration: 750, order: 1 },
  ]);

  ch1.lectures = lectures.filter((l) => l.chapter.toString() === ch1._id.toString()).map((l) => l._id);
  ch2.lectures = lectures.filter((l) => l.chapter.toString() === ch2._id.toString()).map((l) => l._id);
  await ch1.save();
  await ch2.save();
  course.chapters = [ch1._id, ch2._id];
  await course.save();

  await Quiz.create({
    title: 'JEE Physics Mock Test 1',
    category: jeeCat._id,
    educator: educatorUser._id,
    type: 'mock',
    duration: 180,
    totalMarks: 100,
    negativeMarking: true,
    isPublished: true,
    questions: [
      { question: 'What is the SI unit of force?', options: ['Newton', 'Joule', 'Watt', 'Pascal'], correctAnswer: 0, explanation: 'Force is measured in Newtons (N)', marks: 4, negativeMarks: 1 },
      { question: 'Acceleration due to gravity is approximately?', options: ['9.8 m/s²', '10.8 m/s²', '8.8 m/s²', '11.8 m/s²'], correctAnswer: 0, explanation: 'g ≈ 9.8 m/s² on Earth', marks: 4, negativeMarks: 1 },
    ],
  });

  await Batch.create({
    name: 'JEE 2026 Ultimate Batch',
    slug: 'jee-2026-ultimate',
    category: jeeCat._id,
    educator: educatorUser._id,
    courses: [course._id],
    price: 29999,
    isFeatured: true,
    description: 'Complete preparation batch for JEE 2026',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
  });

  console.log('\n✅ Seed complete!\n');
  console.log('Accounts:');
  console.log('  Admin:       admin@inacademy.com / Admin@123');
  console.log('  Educator:    educator@inacademy.com / Educator@123');
  console.log('  Student:     student@inacademy.com / Student@123');
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
