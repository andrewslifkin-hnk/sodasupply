import { Skeleton } from "@/components/ui/skeleton"

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
            <div className="relative h-48 bg-gray-50">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        ))}
    </div>
  )
}
