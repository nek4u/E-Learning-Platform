export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 ${className}`} />;
}

export function CourseCardSkeleton() {
  return (
    <div className="card overflow-hidden p-0">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
