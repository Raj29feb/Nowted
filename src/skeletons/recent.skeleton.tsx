import { Skeleton } from "@/components/ui/skeleton";

export default function RecentsSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="flex flex-col gap-1">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="py-2.5 px-5 flex gap-3.5 items-center">
                    <Skeleton className="h-5 w-5 opacity-60 rounded-full bg-white/60" />
                    <Skeleton className="h-4 w-32 rounded bg-white/60" />
                </div>
            ))}
        </div>
    );
}
