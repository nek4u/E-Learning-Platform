import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { liveApi } from '../../services/api';
import { Video } from 'lucide-react';

export default function LiveClassesPage() {
  const { data } = useQuery({
    queryKey: ['live-classes'],
    queryFn: async () => (await liveApi.getAll({ upcoming: 'true' })).data.data.liveClasses,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="font-display text-3xl font-bold">Live Classes</h1>
      <p className="mt-2 text-slate-600">Join interactive sessions with real-time chat, polls, and doubt solving</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(data || []).map((lc) => (
          <Link key={lc._id} to={`/live/${lc._id}`} className="card group hover:border-primary-300">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-1 text-xs font-bold ${lc.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-primary-100 text-primary-700'}`}>
                {lc.status === 'live' ? 'LIVE' : 'Scheduled'}
              </span>
            </div>
            <h3 className="mt-3 font-semibold group-hover:text-primary-600">{lc.title}</h3>
            <p className="text-sm text-slate-500">{lc.educator?.name}</p>
            <p className="mt-2 text-sm">{new Date(lc.scheduledAt).toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2 text-primary-600">
              <Video className="h-4 w-4" /> Join Class
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
