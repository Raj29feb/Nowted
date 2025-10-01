import { config } from "@/config";
import type { Note } from "@/interfaces/sidebar.interface";
import { formatDate } from "@/lib/date.helper";
import { MoreEnum } from "@/lib/more.enums";
import { NoteCardSkeleton } from "@/skeletons/note-card.skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

export function MidSection() {
    const { folderId, folderName } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState<Note[]>([]);
    const [page, setPage] = useState(1);
    const isMore = (folderName === MoreEnum.Favorites || folderName === MoreEnum.Archived || folderName === MoreEnum.Trash);
    async function selectedFolderQuery({ pg }: { pg: number } = { pg: 1 }) {
        let params = {};
        switch (folderName) {
            case MoreEnum.Favorites:
                params = {
                    page: pg,
                    favorite: true
                };
                break;
            case MoreEnum.Archived:
                params = {
                    page: pg,
                    archived: true
                };
                break;
            case MoreEnum.Trash:
                params = {
                    page: pg,
                    deleted: true
                };
                break;
            default:
                if (folderId) {
                    params = {
                        page: pg,
                        folderId
                    };
                } else {
                    params = {
                        page: pg
                    };
                }
        }
        const res = await axios.get(`${config.base_url}/notes`, {
            params: params
        })
        return res.data;
    }
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['selectedFolder', folderId, folderName],
        queryFn: () => selectedFolderQuery(),
    })
    const { data: nextData, isLoading: nextIsLoading } = useQuery({
        queryKey: ['folderPage', page],
        queryFn: () => selectedFolderQuery({ pg: page }),
        enabled: !!page && page !== 1
    })
    const handleFile = (folderId: string, fon: string, fileName: string, fileId: string) => {

        if (isMore)
            navigate(`/${folderName}/${folderName}Id/${fileName}/${fileId}`);
        else
            navigate(`/${fon}/${folderId}/${fileName}/${fileId}`);
    }
    useEffect(() => {
        if (data) {
            setResult([...data.notes]);
        }
    }, [data])
    useEffect(() => {
        if (nextData) {
            setResult((prev) => [...prev, ...nextData.notes]);
        }
    }, [nextData]);
    if (isError) return <p className="text-white">{(error as Error).message}</p>
    return (<div className="min-w-80 py-7 flex flex-col bg-background-secondary h-screen gap-7">
        {isLoading ? <NoteCardSkeleton /> : <><p className="rounded-sm px-5 text-2xl font-semibold text-white">{folderName ?? '--'}</p>
            <div className="flex flex-col gap-5 px-5 max-h-6/7 overflow-y-auto">
                {result && result.length > 0 ? result.map((item: Note) => <div key={item.id} onClick={() => handleFile(item.folder.id, item.folder.name, item.title, item.id)} className="max-w-80 cursor-pointer rounded-sm flex flex-col bg-white/5 p-5 gap-2.5">
                    <p className="text-lg font-semibold text-white">{item.title}</p>
                    <div className="flex gap-2.5">
                        <p className="text-white/40 text-base">{formatDate(item.createdAt) || '--'}</p>
                        <p className="text-white/40 text-base truncate">{item.preview || 'No preview available'}</p>
                    </div>
                </div>) : <p className="text-white/60 text-center">No notes available to view.</p>}
                {result && result.length < data.total && <div className="flex justify-center">
                    <Button className="bg-primary-blue w-28 text-white font-semibold text-base cursor-pointer" disabled={isLoading} onClick={() => setPage(page + 1)}>{nextIsLoading ? 'Loading...' : 'Load More'}</Button>
                </div>}
            </div>
        </>
        }
    </div>)
}