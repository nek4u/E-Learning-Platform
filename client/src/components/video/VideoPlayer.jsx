import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, PictureInPicture2 } from 'lucide-react';

export default function VideoPlayer({ src, onProgress, initialTime = 0, watermark = 'InAcademy' }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (video && initialTime) {
      video.currentTime = initialTime;
    }
  }, [initialTime, src]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { video.play(); setPlaying(true); }
    else { video.pause(); setPlaying(false); }
  };

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    onProgress?.({ currentTime: video.currentTime, duration: video.duration });
  }, [onProgress]);

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (video) video.currentTime = percent * video.duration;
  };

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const idx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[idx]);
    if (videoRef.current) videoRef.current.playbackRate = speeds[idx];
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!videoRef.current) return;
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'ArrowRight') videoRef.current.currentTime += 10;
      if (e.key === 'ArrowLeft') videoRef.current.currentTime -= 10;
      if (e.key === 'f') videoRef.current.requestFullscreen?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="video-protected relative aspect-video overflow-hidden rounded-2xl bg-black" onContextMenu={(e) => e.preventDefault()}>
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
        onEnded={() => setPlaying(false)}
        controlsList="nodownload"
        disablePictureInPicture={false}
      />
      <div className="pointer-events-none absolute right-4 top-4 rounded bg-black/40 px-3 py-1 text-sm text-white/60">
        {watermark}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="mb-2 h-1 cursor-pointer rounded-full bg-white/30" onClick={handleSeek}>
          <div className="h-full rounded-full bg-primary-500" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
        </div>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="rounded p-1 hover:bg-white/20">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted; }} className="rounded p-1 hover:bg-white/20">
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={changeSpeed} className="rounded px-2 py-1 text-sm hover:bg-white/20">{speed}x</button>
            <button onClick={() => videoRef.current?.requestPictureInPicture?.()} className="rounded p-1 hover:bg-white/20">
              <PictureInPicture2 className="h-5 w-5" />
            </button>
            <button onClick={() => videoRef.current?.requestFullscreen?.()} className="rounded p-1 hover:bg-white/20">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
