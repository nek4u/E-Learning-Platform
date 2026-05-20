import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { liveApi } from '../../services/api';
import { useLiveSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { Send, Hand } from 'lucide-react';

function LiveRoomContent() {
  const { id } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [roomId, setRoomId] = useState(null);

  const joinMutation = useMutation({
    mutationFn: () => liveApi.join(id),
    onSuccess: (res) => setRoomId(res.data.data.roomId),
  });

  useQuery({
    queryKey: ['join-live', id],
    queryFn: () => joinMutation.mutateAsync(),
    enabled: !!id,
  });

  const { emit } = useLiveSocket(roomId, {
    joinData: { userId: user?._id, userName: user?.name },
    events: {
      'chat-message': (msg) => setMessages((m) => [...m, msg]),
      'user-joined': (u) => setMessages((m) => [...m, { message: `${u.userName} joined`, system: true }]),
    },
  });

  const sendMessage = () => {
    if (!input.trim() || !roomId) return;
    emit('chat-message', { roomId, message: input, user: { name: user?.name, id: user?._id } });
    setInput('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-2xl bg-slate-900 flex items-center justify-center text-white">
            <p>Live stream room: {roomId || 'Connecting...'}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => emit('raise-hand', { roomId, user })} className="btn-secondary"><Hand className="h-4 w-4" /> Raise Hand</button>
            <button onClick={() => emit('reaction', { roomId, emoji: '👍', user })} className="btn-secondary">👍</button>
            <button onClick={() => emit('reaction', { roomId, emoji: '❤️', user })} className="btn-secondary">❤️</button>
          </div>
        </div>
        <div className="card flex flex-col h-[500px]">
          <h3 className="font-semibold border-b pb-2">Live Chat</h3>
          <div className="flex-1 overflow-y-auto py-4 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm ${m.system ? 'text-slate-500 italic' : ''}`}>
                {m.user?.name && <span className="font-medium">{m.user.name}: </span>}
                {m.message}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t pt-4">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="input-field flex-1 text-sm" placeholder="Type a message..." />
            <button onClick={sendMessage} className="btn-primary p-3"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveRoomPage() {
  return <ProtectedRoute><LiveRoomContent /></ProtectedRoute>;
}
