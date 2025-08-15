import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-8">
        {/* Title Skeleton */}
        <div className="space-y-4 text-center">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-lg border">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-2/3" />
              </div>
              <div className="md:col-span-2">
                 <Skeleton className="h-12 w-1/4 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
