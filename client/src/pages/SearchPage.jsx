import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { searchApi } from '../services/api';
import CourseCard from '../components/courses/CourseCard';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');

  const { data, refetch } = useQuery({
    queryKey: ['search', params.get('q')],
    queryFn: async () => (await searchApi.search(params.get('q') || '')).data.data,
    enabled: !!params.get('q'),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setParams({ q });
    refetch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Search</h1>
      <form onSubmit={handleSearch} className="mt-6 flex gap-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, educators..." className="input-field flex-1" />
        <button type="submit" className="btn-primary">Search</button>
      </form>
      {data && (
        <div className="mt-12 space-y-12">
          {data.courses?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold">Courses</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {data.courses.map((c, i) => <CourseCard key={c._id} course={c} index={i} />)}
              </div>
            </section>
          )}
          {data.educators?.length > 0 && (
            <section>
              <h2 className="text-xl font-bold">Educators</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {data.educators.map((e) => (
                  <div key={e._id} className="card flex items-center gap-4">
                    <img src={e.avatar || `https://ui-avatars.com/api/?name=${e.name}`} alt="" className="h-12 w-12 rounded-full" />
                    <div><p className="font-semibold">{e.name}</p><p className="text-sm text-slate-500">{e.bio}</p></div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
