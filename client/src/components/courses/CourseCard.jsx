import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Clock } from 'lucide-react';

export default function CourseCard({ course, index = 0 }) {
  const price = course.discountPrice ?? course.price;
  const originalPrice = course.discountPrice ? course.price : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card group overflow-hidden p-0"
    >
      <Link to={`/courses/${course.slug}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
            alt={course.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {course.isFree && (
            <span className="absolute left-3 top-3 rounded-full bg-green-500 px-2 py-1 text-xs font-bold text-white">FREE</span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
            {course.category?.name || 'Course'}
          </p>
          <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 group-hover:text-primary-600 dark:text-white">
            {course.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{course.educator?.name}</p>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {course.ratings?.average?.toFixed(1) || '4.5'}
            </span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.enrollmentCount?.toLocaleString() || 0}</span>
            {course.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.round(course.duration / 60)}h</span>}
          </div>
          <div className="mt-3 flex items-center gap-2">
            {course.isFree ? (
              <span className="font-bold text-green-600">Free</span>
            ) : (
              <>
                <span className="font-bold text-slate-900 dark:text-white">₹{price?.toLocaleString()}</span>
                {originalPrice && <span className="text-sm text-slate-400 line-through">₹{originalPrice?.toLocaleString()}</span>}
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
