import { config } from "@/config";
import type { Folder, Note } from "@/interfaces/sidebar.interface";
import { formatDate } from "@/lib/date.helper";
import { MoreEnum } from "@/lib/more.enums";
import { NoteCardSkeleton } from "@/skeletons/note-card.skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { FileText, FolderIcon } from "lucide-react";
import { toast } from "react-toastify";

export function MidSection() {
    const { folderId, folderName } = useParams();
    const [trashNotes, setTrashNotes] = useState(true);
    const queryClient = useQueryClient();
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
        queryKey: ['selectedFolder', folderId, folderName, page],
        queryFn: () => selectedFolderQuery({ pg: page }),
    })

    const { data: trashFolderData, isLoading: trashFoldersLoading } = useQuery({
        queryKey: ['trashFolders'],
        queryFn: async () => {
            const res = await axios.get(`${config.base_url}/folders`, { params: { deleted: true } });
            return res.data.folders;
        },
        enabled: !trashNotes
    })

    const folderRestoreMutation = useMutation({
        mutationFn: async ({ folderId }: { folderId: string }) => {
            const res = await axios.post(`${config.base_url}/folders/${folderId}/restore`);
            return res.data;
        },
        onSuccess: (data: string) => {
            queryClient.invalidateQueries({ queryKey: ["trashFolders"] });
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            toast.success(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleFile = (folderId: string, fon: string, fileId: string) => {

        if (isMore)
            navigate(`/${folderName}/${folderName}Id/${fileId}`);
        else
            navigate(`/${fon}/${folderId}/${fileId}`);
    }

    useEffect(() => {
        if (page === 1 && data) {
            setResult([...data.notes]);
        }
        else if (data && page !== 1) {
            setResult((prev) => [...prev, ...data.notes]);
        }
    }, [data])

    useEffect(() => {
        setPage(1);
        if (folderName !== MoreEnum.Trash) {
            setTrashNotes(true);
        }
    }, [folderId])

    if (isError) return <p className="text-white">{(error as Error).message}</p>

    return (<div className="min-w-80 py-7 flex flex-col bg-secondary h-screen gap-7">
        {isLoading ? <NoteCardSkeleton /> : <>
            <div className="flex justify-between px-5 items-center text-white">
                <p className="rounded-sm text-2xl font-semibold">{folderName ?? '--'}</p>
                {folderName === MoreEnum.Trash && <button>{trashNotes ? <FolderIcon aria-label="select trash folder" aria-description="Click to see trashed folders" className="cursor-pointer" size={20} onClick={() => setTrashNotes(false)} /> : <FileText aria-label="select trash notes" aria-description="Click to see trashed notes" className="cursor-pointer" size={20} onClick={() => setTrashNotes(true)} />}</button>}
            </div>
            {trashNotes ?
                <div className="flex flex-col gap-5 px-5 max-h-6/7 overflow-y-auto">
                    {result && result.length > 0 ? result.map((item: Note) => <div key={item.id} onClick={() => handleFile(item.folder.id, item.folder.name, item.id)} className="max-w-80 cursor-pointer rounded-sm flex flex-col bg-white/5 p-5 gap-2.5">
                        <p className="text-lg font-semibold text-white">{item.title}</p>
                        <div className="flex gap-2.5">
                            <p className="text-white/40 text-base">{formatDate(item.createdAt) || '--'}</p>
                            <p className="text-white/40 text-base truncate">{item.preview || 'No preview available'}</p>
                        </div>
                    </div>) : <p className="text-white/60 text-center">No notes available to view.</p>}
                    {data && result && result.length < data.total && <div className="flex justify-center">
                        <Button className="bg-primary-blue w-28 text-white font-semibold text-base cursor-pointer" disabled={isLoading} onClick={() => setPage(page + 1)}>{isLoading ? 'Loading...' : 'Load More'}</Button>
                    </div>}
                </div> :
                <>
                    {trashFoldersLoading ? <NoteCardSkeleton notes={false} /> : <div className="flex flex-col gap-5 px-5 max-h-6/7 overflow-y-auto">
                        {trashFolderData && trashFolderData.length > 0 ? trashFolderData.map((item: Folder) => <div key={item.id} className="max-w-80 rounded-sm flex flex-col bg-white/5 p-5 gap-2.5">
                            <p className="text-lg font-semibold text-white">{item.name}</p>
                            <div className="flex gap-2.5">
                                <p className="text-white/40 text-base">{formatDate(item.createdAt) || '--'}</p>
                                <img src="/logos/restore.svg" alt='restore-folder-logo' width='20' height='20' className="cursor-pointer" onClick={() => folderRestoreMutation.mutate({ folderId: item.id })} />
                            </div>
                        </div>) : <p className="text-white/60 text-center">No folders available to view.</p>}
                    </div>}
                </>
            }
        </>
        }
    </div>)
}