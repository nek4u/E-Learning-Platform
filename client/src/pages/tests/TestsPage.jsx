import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { quizApi } from '../../services/api';

export default function TestsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => (await quizApi.getAll({ limit: 20 })).data,
  });

  const quizzes = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Mock Tests & Quizzes</h1>
      <p className="mt-2 text-slate-600">Practice with timed tests, negative marking, and AI analytics</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : quizzes.map((q) => (
          <Link key={q._id} to={`/tests/${q._id}`} className="card hover:border-primary-300 transition">
            <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{q.type}</span>
            <h3 className="mt-2 font-semibold">{q.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{q.duration} min • {q.totalMarks} marks</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
