import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { courseApi } from '../../services/api';
import CourseCard from '../../components/courses/CourseCard';
import { CourseCardSkeleton } from '../../components/common/Skeleton';

export default function CoursesPage() {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['courses', search, level],
    queryFn: async () => (await courseApi.getAll({ search, level, limit: 20 })).data,
  });

  const courses = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold">All Courses</h1>
      <div className="mt-6 flex flex-wrap gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="input-field max-w-md flex-1"
        />
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="input-field w-auto">
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array(8).fill(0).map((_, i) => <CourseCardSkeleton key={i} />)
          : courses.map((c, i) => <CourseCard key={c._id} course={c} index={i} />)}
      </div>
      {!isLoading && courses.length === 0 && (
        <p className="mt-12 text-center text-slate-500">No courses found. Run seed script to populate data.</p>
      )}
    </div>
  );
}
