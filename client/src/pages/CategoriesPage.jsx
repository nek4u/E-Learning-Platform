import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { categoryApi } from '../services/api';
import { EXAM_CATEGORIES } from '../constants';

export default function CategoriesPage() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await categoryApi.getAll()).data.data.categories,
  });

  const categories = data || EXAM_CATEGORIES;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold">All Categories</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => (
          <Link key={cat.slug} to={`/category/${cat.slug}`} className="card flex flex-col items-center p-8 text-center hover:border-primary-300 transition">
            <span className="text-4xl">{cat.icon || '📚'}</span>
            <span className="mt-3 font-semibold">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
