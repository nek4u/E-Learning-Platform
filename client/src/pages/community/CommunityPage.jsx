import { useQuery } from '@tanstack/react-query';
import { communityApi } from '../../services/api';
import { MessageCircle, Heart } from 'lucide-react';

export default function CommunityPage() {
  const { data } = useQuery({
    queryKey: ['community'],
    queryFn: async () => (await communityApi.getPosts({ limit: 20 })).data,
  });

  const posts = data?.data || [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Community</h1>
      <p className="mt-2 text-slate-600">Discussions, doubts, and announcements</p>
      <div className="mt-8 space-y-6">
        {posts.map((post) => (
          <article key={post._id} className="card">
            <div className="flex items-center gap-3">
              <img src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.name}`} alt="" className="h-10 w-10 rounded-full" />
              <div>
                <p className="font-semibold">{post.author?.name}</p>
                <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {post.title && <h3 className="mt-3 font-semibold">{post.title}</h3>}
            <p className="mt-2 text-slate-600 dark:text-slate-400">{post.content}</p>
            <div className="mt-4 flex gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> {post.likes?.length || 0}</span>
              <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {post.replies?.length || 0} replies</span>
            </div>
          </article>
        ))}
        {posts.length === 0 && <p className="text-center text-slate-500">No posts yet. Be the first to start a discussion!</p>}
      </div>
    </div>
  );
}
