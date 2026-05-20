import { useQuery } from '@tanstack/react-query';
import { educatorApi } from '../../services/api';
import { DollarSign, Users, BookOpen } from 'lucide-react';

export default function EducatorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['educator-dashboard'],
    queryFn: async () => (await educatorApi.dashboard()).data.data,
  });

  if (isLoading) return <div>Loading...</div>;

  const stats = data?.stats || {};

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Educator Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4">
          <BookOpen className="h-10 w-10 text-primary-500" />
          <div><p className="text-sm text-slate-500">Courses</p><p className="text-2xl font-bold">{stats.courses}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <Users className="h-10 w-10 text-green-500" />
          <div><p className="text-sm text-slate-500">Students</p><p className="text-2xl font-bold">{stats.students}</p></div>
        </div>
        <div className="card flex items-center gap-4">
          <DollarSign className="h-10 w-10 text-amber-500" />
          <div><p className="text-sm text-slate-500">Revenue</p><p className="text-2xl font-bold">₹{stats.revenue?.toLocaleString()}</p></div>
        </div>
      </div>
      <section className="mt-8">
        <h2 className="font-bold">Your Courses</h2>
        <div className="mt-4 space-y-4">
          {(data?.courses || []).map((c) => (
            <div key={c._id} className="card flex justify-between">
              <div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-slate-500">{c.enrollmentCount} students • {c.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="font-bold">Upcoming Live Classes</h2>
        <div className="mt-4 space-y-2">
          {(data?.liveClasses || []).map((lc) => (
            <div key={lc._id} className="card">
              <h3 className="font-semibold">{lc.title}</h3>
              <p className="text-sm text-slate-500">{new Date(lc.scheduledAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
