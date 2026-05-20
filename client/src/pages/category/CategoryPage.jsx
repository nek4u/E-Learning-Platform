import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../../services/api';
import CourseCard from '../../components/courses/CourseCard';
import { Link } from 'react-router-dom';

export default function CategoryPage() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => (await categoryApi.getBySlug(slug)).data.data,
  });

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" /></div>;

  const { category, courses, batches, quizzes } = data || {};

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-4xl font-bold">{category?.name}</h1>
      <p className="mt-2 text-slate-600">{category?.description || `Prepare for ${category?.name} with top courses and mock tests`}</p>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Courses</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses?.map((c, i) => <CourseCard key={c._id} course={c} index={i} />)}
        </div>
      </section>

      {batches?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Batches</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {batches.map((b) => (
              <div key={b._id} className="card">
                <h3 className="font-semibold">{b.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{b.description}</p>
                <p className="mt-2 font-bold">₹{b.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {quizzes?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Mock Tests</h2>
          <div className="mt-6 space-y-4">
            {quizzes.map((q) => (
              <Link key={q._id} to={`/tests/${q._id}`} className="card block hover:border-primary-300">
                <h3 className="font-semibold">{q.title}</h3>
                <p className="text-sm text-slate-500">{q.duration} mins • {q.questions?.length} questions</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
