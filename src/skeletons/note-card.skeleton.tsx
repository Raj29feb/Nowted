import { Skeleton } from "@/components/ui/skeleton"

export function NoteCardSkeleton({ notes = true }: { notes?: boolean }) {
    return (
        <div className="flex flex-col gap-5">
            <Skeleton className="bg-white/60 rounded-sm px-5 h-10 w-1/3 text-2xl" />
            <div className="flex flex-col gap-5 px-5 max-h-[80vh] overflow-y-auto">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="rounded-sm flex flex-col bg-white/5 p-5 gap-2.5"
                    >
                        <Skeleton className="h-6 w-2/3 rounded-sm bg-white/60" />
                        <div className="flex gap-2.5">
                            <Skeleton className="h-4 w-24 rounded-sm bg-white/60" />
                            {notes ? <Skeleton className="h-4 w-40 rounded-sm bg-white/60" /> : <Skeleton className="h-5 w-5 rounded-full bg-white/60" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
