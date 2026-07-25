const SkeletonTable = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden p-6 animate-pulse">
      {/* Table Header Skeleton */}
      <div className="flex gap-4 border-b border-slate-800 pb-4 mb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-5 bg-slate-800 rounded-md flex-1" />
        ))}
      </div>
      {/* Table Rows Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 py-2 border-b border-slate-800/40 last:border-0">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`h-4 bg-slate-800/60 rounded-md flex-1 ${
                  colIndex === cols - 1 ? "w-2/3" : ""
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
