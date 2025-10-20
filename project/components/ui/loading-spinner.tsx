export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-dark-border"></div>
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-br from-primary via-primary-light to-accent-yellow rounded-2xl p-8 border border-primary/20 animate-pulse">
        <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-white/10 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-2/3 mb-6"></div>
        <div className="h-12 bg-white/20 rounded w-48"></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-16 mb-3"></div>
            <div className="h-8 bg-gray-700 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

