import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { quizApi } from '../../services/api';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import toast from 'react-hot-toast';

function TestContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const { data } = useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => (await quizApi.getById(id)).data.data.quiz,
  });

  useEffect(() => {
    if (data?.duration) {
      setTimeLeft(data.duration * 60);
      const timer = setInterval(() => setTimeLeft((t) => (t <= 1 ? (clearInterval(timer), 0) : t - 1)), 1000);
      return () => clearInterval(timer);
    }
  }, [data]);

  const submitMutation = useMutation({
    mutationFn: () => quizApi.submit(id, {
      answers: Object.entries(answers).map(([questionIndex, selectedAnswer]) => ({
        questionIndex: Number(questionIndex),
        selectedAnswer,
      })),
      timeTaken: data.duration * 60 - (timeLeft || 0),
    }),
    onSuccess: (res) => {
      setSubmitted(true);
      setResult(res.data.data);
      toast.success('Test submitted!');
    },
  });

  if (!data) return <div className="p-12 text-center">Loading...</div>;

  if (submitted && result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-3xl font-bold">Results</h1>
        <p className="mt-4 text-5xl font-bold text-primary-600">{result.attempt.percentage?.toFixed(1)}%</p>
        <p className="mt-2">Score: {result.attempt.score} / {result.attempt.totalMarks}</p>
        {result.attempt.aiAnalysis && <p className="mt-6 card text-left">{result.attempt.aiAnalysis}</p>}
        <button onClick={() => navigate('/tests')} className="btn-primary mt-8">Back to Tests</button>
      </div>
    );
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="sticky top-20 z-10 flex items-center justify-between glass rounded-xl p-4 mb-8">
        <h1 className="font-bold">{data.title}</h1>
        {timeLeft !== null && <span className="font-mono text-lg text-red-600">{formatTime(timeLeft)}</span>}
      </div>
      {data.questions?.map((q, i) => (
        <div key={i} className="card mb-6">
          <p className="font-medium">Q{i + 1}. {q.question}</p>
          <div className="mt-4 space-y-2">
            {q.options?.map((opt, j) => (
              <label key={j} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${answers[i] === j ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700'}`}>
                <input type="radio" name={`q${i}`} checked={answers[i] === j} onChange={() => setAnswers({ ...answers, [i]: j })} />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending} className="btn-primary w-full">
        Submit Test
      </button>
    </div>
  );
}

export default function TestAttemptPage() {
  return <ProtectedRoute><TestContent /></ProtectedRoute>;
}
