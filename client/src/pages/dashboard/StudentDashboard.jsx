import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { studentApi } from '../../services/api';
import { Flame, Trophy, BookOpen, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: async () => (await studentApi.dashboard()).data.data,
  });

  if (isLoading) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800" />)}</div>;

  const chartData = (data?.testAnalytics || []).map((a, i) => ({
    name: `Test ${i + 1}`,
    score: a.percentage || 0,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Student Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Flame, label: 'Streak', value: `${data?.user?.streak || 0} days`, color: 'text-orange-500' },
          { icon: Trophy, label: 'XP Points', value: data?.user?.xp || 0, color: 'text-amber-500' },
          { icon: BookOpen, label: 'Courses', value: data?.enrollments?.length || 0, color: 'text-primary-500' },
          { icon: Calendar, label: 'Live Classes', value: data?.upcomingLive?.length || 0, color: 'text-green-500' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <s.icon className={`h-10 w-10 ${s.color}`} />
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Continue Learning</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(data?.continueLearning || []).map((e) => (
            <Link key={e._id} to={`/courses/${e.course?.slug}`} className="card hover:border-primary-300">
              <h3 className="font-semibold">{e.course?.title}</h3>
              <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                <div className="h-full rounded-full bg-primary-500" style={{ width: `${e.completionPercentage}%` }} />
              </div>
              <p className="mt-1 text-sm text-slate-500">{e.completionPercentage}% complete</p>
            </Link>
          ))}
        </div>
      </section>

      {chartData.length > 0 && (
        <section className="card mt-8">
          <h2 className="text-lg font-bold">Test Performance</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}
