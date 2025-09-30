import { Skeleton } from "@/components/ui/skeleton";

export function FoldersSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="max-h-44 overflow-scroll flex flex-col gap-1.5">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="py-2.5 px-5 flex gap-3.5 items-center">
                    <Skeleton className="h-5 w-5 bg-white/60 rounded-full" />
                    <Skeleton className="h-4 w-32 bg-white/60 rounded" />
                </div>
            ))}
        </div>
    );
}
