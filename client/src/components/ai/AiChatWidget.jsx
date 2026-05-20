import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { toggleAiChat } from '../../redux/slices/uiSlice';
import { aiApi } from '../../services/api';
import toast from 'react-hot-toast';

export default function AiChatWidget() {
  const open = useSelector((s) => s.ui.aiChatOpen);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your InAcademy AI tutor. Ask me anything about your studies!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const { data } = await aiApi.chat(userMsg);
      setMessages((m) => [...m, { role: 'assistant', content: data.data.response }]);
    } catch {
      toast.error('AI chat unavailable. Please login.');
      setMessages((m) => [...m, { role: 'assistant', content: 'Please login to use AI features.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 flex h-[480px] w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3 text-white">
              <div className="flex items-center gap-2"><Sparkles className="h-5 w-5" /><span className="font-semibold">AI Tutor</span></div>
              <button onClick={() => dispatch(toggleAiChat())}><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && <div className="text-sm text-slate-500">Thinking...</div>}
            </div>
            <div className="flex gap-2 border-t border-slate-200 p-4 dark:border-slate-700">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask a doubt..." className="input-field flex-1 text-sm" />
              <button onClick={send} className="btn-primary p-3"><Send className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!open && (
        <button onClick={() => dispatch(toggleAiChat())} className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-lg hover:scale-105 transition">
          <Sparkles className="h-6 w-6" />
        </button>
      )}
    </>
  );
}
