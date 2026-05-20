import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Users, BookOpen, Award, ChevronRight, Zap } from 'lucide-react';
import { homeApi } from '../services/api';
import CourseCard from '../components/courses/CourseCard';
import { CourseCardSkeleton } from '../components/common/Skeleton';
import { EXAM_CATEGORIES } from '../constants';

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['home'],
    queryFn: async () => (await homeApi.getHome()).data.data,
  });

  const stats = data?.statistics || {};

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 py-20 text-white lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm backdrop-blur">
              <Zap className="h-4 w-4 text-amber-400" /> India&apos;s #1 Learning Platform
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight lg:text-6xl">
              Learn Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400">Limits</span>
            </h1>
            <p className="mt-6 text-lg text-primary-100 lg:text-xl">
              Master UPSC, JEE, NEET, GATE & more with live classes, AI-powered study tools, and India&apos;s best educators.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary bg-white text-primary-700 hover:bg-primary-50">
                Explore Courses <ChevronRight className="h-4 w-4" />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-semibold backdrop-blur hover:bg-white/10">
                <Play className="h-4 w-4" /> Start Free Trial
              </Link>
            </div>
          </motion.div>
          <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { icon: Users, label: 'Students', value: `${(stats.students || 50000).toLocaleString()}+` },
              { icon: BookOpen, label: 'Courses', value: `${(stats.courses || 500).toLocaleString()}+` },
              { icon: Award, label: 'Educators', value: `${(stats.educators || 200).toLocaleString()}+` },
              { icon: Play, label: 'Hours Watched', value: stats.hoursWatched || '10M+' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="glass rounded-2xl p-6 text-center">
                <s.icon className="mx-auto h-8 w-8 text-primary-300" />
                <p className="mt-2 font-display text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-primary-200">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold">Popular Categories</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Choose your exam and start learning</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {(data?.categories || EXAM_CATEGORIES).map((cat, i) => (
              <motion.div key={cat.slug} whileHover={{ scale: 1.03 }}>
                <Link to={`/category/${cat.slug}`} className="card flex flex-col items-center p-6 text-center hover:border-primary-300">
                  <span className="text-3xl">{cat.icon || '📚'}</span>
                  <span className="mt-2 font-semibold">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Courses */}
      <section className="bg-slate-100 py-16 dark:bg-slate-900/50 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">Trending Courses</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Most popular right now</p>
            </div>
            <Link to="/courses" className="text-primary-600 font-semibold hover:underline">View all</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array(4).fill(0).map((_, i) => <CourseCardSkeleton key={i} />)
              : (data?.trendingCourses || []).map((c, i) => <CourseCard key={c._id} course={c} index={i} />)}
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="glass overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600/10 to-accent-500/10 p-8 lg:p-12">
            <div className="flex flex-col items-center gap-8 lg:flex-row">
              <div className="flex-1">
                <h2 className="font-display text-3xl font-bold">AI-Powered Learning</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  Get instant doubt solving, personalized study plans, performance analytics, and smart recommendations.
                </p>
                <Link to="/register" className="btn-primary mt-6">Try AI Tutor Free</Link>
              </div>
              <div className="text-8xl">🤖</div>
            </div>
          </div>
        </div>
      </section>

      {/* Educators */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="font-display text-3xl font-bold">Featured Educators</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(data?.educators || []).map((edu) => (
              <div key={edu._id} className="card flex items-center gap-4">
                <img src={edu.avatar || `https://ui-avatars.com/api/?name=${edu.name}`} alt="" className="h-16 w-16 rounded-full" />
                <div>
                  <h3 className="font-semibold">{edu.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{edu.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-100 py-16 dark:bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="text-center font-display text-3xl font-bold">FAQs</h2>
          {[
            { q: 'Is there a free trial?', a: 'Yes! New users get access to free preview lectures and a 7-day premium trial.' },
            { q: 'Can I watch on mobile?', a: 'Absolutely. InAcademy works on web, Android, and iOS with offline downloads.' },
            { q: 'How do live classes work?', a: 'Join scheduled live sessions with chat, polls, and doubt solving in real-time.' },
          ].map((faq) => (
            <details key={faq.q} className="card mt-4">
              <summary className="cursor-pointer font-semibold">{faq.q}</summary>
              <p className="mt-2 text-slate-600 dark:text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
