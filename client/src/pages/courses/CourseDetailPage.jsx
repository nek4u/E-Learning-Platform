import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi, wishlistApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { Star, Users, Clock, Heart, Play } from 'lucide-react';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => (await courseApi.getBySlug(slug)).data.data,
  });

  const enrollMutation = useMutation({
    mutationFn: () => courseApi.enroll(data.course._id),
    onSuccess: () => {
      toast.success('Enrolled successfully!');
      qc.invalidateQueries(['course', slug]);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Enrollment failed'),
  });

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;

  const { course, reviews, enrollment, related } = data || {};
  if (!course) return <div className="p-12 text-center">Course not found</div>;

  const firstLecture = course.chapters?.[0]?.lectures?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <img src={course.thumbnail} alt="" className="aspect-video w-full rounded-2xl object-cover" />
          <h1 className="mt-6 font-display text-3xl font-bold">{course.title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{course.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{course.ratings?.average}</span>
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{course.enrollmentCount} students</span>
            <span>{course.educator?.name}</span>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold">Curriculum</h2>
            {course.chapters?.map((ch) => (
              <div key={ch._id} className="card mt-4">
                <h3 className="font-semibold">{ch.title}</h3>
                <ul className="mt-2 space-y-2">
                  {ch.lectures?.map((lec) => (
                    <li key={lec._id} className="flex items-center justify-between text-sm">
                      <span>{lec.title}</span>
                      {enrollment && (
                        <Link to={`/learn/${course.slug}/${lec._id}`} className="text-primary-600 hover:underline flex items-center gap-1">
                          <Play className="h-3 w-3" /> Watch
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="card sticky top-24 h-fit">
          <div className="text-3xl font-bold">
            {course.isFree ? 'Free' : `₹${(course.discountPrice || course.price)?.toLocaleString()}`}
          </div>
          {enrollment ? (
            <Link to={firstLecture ? `/learn/${course.slug}/${firstLecture._id || firstLecture}` : '#'} className="btn-primary mt-4 w-full">
              Continue Learning ({enrollment.completionPercentage}%)
            </Link>
          ) : (
            <button
              onClick={() => isAuthenticated ? enrollMutation.mutate() : toast.error('Please login')}
              disabled={enrollMutation.isPending}
              className="btn-primary mt-4 w-full"
            >
              {course.isFree ? 'Enroll Free' : 'Buy Now'}
            </button>
          )}
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            {course.outcomes?.map((o, i) => <li key={i}>✓ {o}</li>)}
          </ul>
        </div>
      </div>
      {related?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">Related Courses</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">{related.map((c) => <Link key={c._id} to={`/courses/${c.slug}`} className="card hover:border-primary-300">{c.title}</Link>)}</div>
        </section>
      )}
    </div>
  );
}
