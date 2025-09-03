export function Skeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="w-full max-w-xl mx-auto p-4 space-y-3">
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className="h-8 w-full rounded-md bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  )
}
