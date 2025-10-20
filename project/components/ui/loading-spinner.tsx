export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-dark-card rounded-2xl p-8 h-48">
        <div className="h-8 bg-dark-bg rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-dark-bg rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-dark-bg rounded w-2/3"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-dark-card rounded-xl p-6 h-32">
            <div className="h-6 w-6 bg-dark-bg rounded mb-3"></div>
            <div className="h-8 bg-dark-bg rounded w-16 mb-2"></div>
            <div className="h-4 bg-dark-bg rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
