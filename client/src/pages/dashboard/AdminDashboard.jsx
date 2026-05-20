import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import { Users, BookOpen, DollarSign, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => (await adminApi.dashboard()).data.data,
  });

  const stats = data?.stats || {};

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: 'Total Users', value: stats.users },
          { icon: BookOpen, label: 'Published Courses', value: stats.courses },
          { icon: DollarSign, label: 'Revenue', value: `₹${(stats.revenue || 0).toLocaleString()}` },
          { icon: AlertCircle, label: 'Pending Approval', value: stats.pendingCourses },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <s.icon className="h-10 w-10 text-primary-500" />
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-slate-600">Manage users, moderate courses, banners, and platform analytics from the sidebar.</p>
    </div>
  );
}
