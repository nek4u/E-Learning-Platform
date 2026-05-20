import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { courseApi } from '../../services/api';
import VideoPlayer from '../../components/video/VideoPlayer';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import { useState } from 'react';

function LearnContent() {
  const { slug, lectureId } = useParams();
  const [note, setNote] = useState('');

  const { data } = useQuery({
    queryKey: ['course', slug],
    queryFn: async () => (await courseApi.getBySlug(slug)).data.data,
  });

  const progressMutation = useMutation({
    mutationFn: (progress) => courseApi.updateProgress(data?.course?._id, {
      lectureId,
      watchedSeconds: progress.currentTime,
      completed: progress.currentTime / progress.duration > 0.9,
    }),
  });

  const course = data?.course;
  let lecture = null;
  course?.chapters?.forEach((ch) => {
    ch.lectures?.forEach((l) => {
      if (l._id === lectureId || l === lectureId) lecture = typeof l === 'object' ? l : { _id: l };
    });
  });

  const enrollment = data?.enrollment;
  const savedProgress = enrollment?.progress?.find((p) => p.lecture === lectureId || p.lecture?._id === lectureId);

  if (!lecture?.videoUrl && !lecture) {
    return <div className="p-12 text-center">Lecture not found or not enrolled</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VideoPlayer
            src={lecture.videoUrl}
            initialTime={savedProgress?.watchedSeconds || 0}
            onProgress={(p) => progressMutation.mutate(p)}
          />
          <h1 className="mt-4 text-2xl font-bold">{lecture.title}</h1>
          {lecture.aiSummary && <p className="mt-2 text-slate-600">{lecture.aiSummary}</p>}
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold">Course Content</h3>
            <ul className="mt-4 max-h-96 space-y-2 overflow-y-auto text-sm">
              {course?.chapters?.map((ch) => (
                <li key={ch._id}>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{ch.title}</p>
                  {ch.lectures?.map((l) => (
                    <a key={l._id} href={`/learn/${slug}/${l._id}`} className="block py-1 pl-4 text-primary-600 hover:underline">
                      {l.title}
                    </a>
                  ))}
                </li>
              ))}
            </ul>
          </div>
          <div className="card">
            <h3 className="font-semibold">My Notes</h3>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input-field mt-2 h-32 text-sm" placeholder="Take notes..." />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <LearnContent />
    </ProtectedRoute>
  );
}
