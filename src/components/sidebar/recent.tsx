import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Note } from "../../interfaces/sidebar.interface";
import RecentsSkeleton from "@/skeletons/recent.skeleton";
import { config } from "@/config";
import { useNavigate, useParams } from "react-router-dom";
export function Recent() {
    const { fileId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['recentNotes'],
        queryFn: async () => {
            const res = await axios.get(`${config.base_url}/notes/recent`);
            return res.data.recentNotes;
        }
    });
    if (isError) return <p>Error: {(error as Error).message}</p>;
    const handleFile = (folderId: string, folderName: string, fileName: string, fileId: string) => {
        navigate(`/${folderName}/${folderId}/${fileName}/${fileId}`);
    }
    return <div className="flex flex-col gap-2">
        <p className="px-5 font-semibold text-sm text-white/60">Recents</p>
        {isLoading ? <RecentsSkeleton /> : <div className="flex flex-col gap-1">
            {data.map((item: Note) => <div key={item.id} className={`${item.id === fileId && 'bg-primary-blue'} hover:bg-[var(--primary-blue)] cursor-pointer py-2.5 px-5 flex gap-3.5`} onClick={() => handleFile(item.folder.id, item.folder.name, item.title, item.id)}>
                <img className={`${item.id !== fileId && 'opacity-60'}`} src="/logos/doc.svg" width='20' height='20' />
                <p className={`${item.id === fileId ? 'text-white' : 'text-white/60'} font-semibold text-base`}>{item.title}</p>
            </div>)}
        </div>}
    </div>
}