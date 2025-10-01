import { Skeleton } from "@/components/ui/skeleton"

function RowSkeleton() {
    return <div className="flex gap-5 items-center">
        <Skeleton className="h-5 w-5 rounded bg-white/60" />
        <Skeleton className="h-4 w-16 rounded bg-white/60" />
        <Skeleton className="h-4 w-28 rounded bg-white/60" />
    </div>
}

export function NoteSkeleton() {
    return (
        <div className="bg-background w-full p-12 flex flex-col gap-7">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-40 rounded bg-white/60" />
                <Skeleton className="h-7 w-7 rounded-full bg-white/60" />
            </div>
            <div className="flex flex-col gap-3.5">
                <RowSkeleton />
                <hr className="border-white/20" />
                <RowSkeleton />
                <Skeleton className="h-20 w-full rounded bg-white/60" />
            </div>
        </div>
    )
}
