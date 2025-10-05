import { formatDate } from "@/lib/date.helper";
import { NoteSkeleton } from "@/skeletons/note.skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Folder } from "@/interfaces/sidebar.interface";
import { MoreEnum, MoreValue } from "@/lib/more.enums";
import { config } from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarDays, FileText, Folder as FolderIcon } from "lucide-react";
import { Input } from "./ui/input";
import { PageContext } from "@/context";

type option = { logo: string, text: string, id: number, alt: string }

export function OpenedSecton() {
    const { folderName: folname, fileId } = useParams();
    const isMore = (folname === MoreEnum.Favorites || folname === MoreEnum.Archived || folname === MoreEnum.Trash);
    const [noteName, setNoteName] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const folders = queryClient.getQueryData(["folders"]) as Folder[];
    const { setPage } = useContext(PageContext);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['note', fileId],
        queryFn: async () => {
            const res = await axios.get(`${config.base_url}/notes/${fileId}`);
            setNoteName(res.data.note.title);
            setNoteContent(res.data.note.content);
            return res.data.note;
        },
        enabled: !!fileId
    })

    const mutation = useMutation({
        mutationFn: async (data: { title?: string, content?: string, folderId?: string, isFavorite?: boolean, isArchived?: boolean }) => {
            const res = await axios.patch(`${config.base_url}/notes/${fileId}`, data);
            return res.data;
        },
        onSuccess: async (data: string) => {
            setPage(1);
            await queryClient.invalidateQueries({ queryKey: ["note", fileId] });
            await queryClient.invalidateQueries({ queryKey: ["selectedFolder"] });
            await queryClient.invalidateQueries({ queryKey: ["recentNotes"] });
            toast.success(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const res = await axios.delete(`${config.base_url}/notes/${fileId}`);
            return res.data;
        },
        onSuccess: async (data: string) => {
            setPage(1);
            await queryClient.invalidateQueries({ queryKey: ["selectedFolder"] });
            queryClient.invalidateQueries({ queryKey: ["note", fileId] });
            toast.success(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const restoreMutation = useMutation({
        mutationFn: async (_params: { foldName: string; foldId: string }) => {
            const res = await axios.post(`${config.base_url}/notes/${fileId}/restore`);
            return res.data;
        },
        onSuccess: async (data: string, { foldName, foldId }) => {
            toast.success(data);
            setPage(1);
            await queryClient.invalidateQueries({ queryKey: ["recentNotes"] });
            await queryClient.invalidateQueries({ queryKey: ["folders"] });
            await queryClient.invalidateQueries({ queryKey: ["note"] });
            navigate(`/${foldName}/${foldId}/${fileId}`);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleNoteNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        mutation.mutate({ title: e.target.value });
    };

    const handleNoteContentBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        mutation.mutate({ content: e.target.value });
    };

    const handleFolderChange = (folderId: string, folderName: string) => {
        mutation.mutate({ folderId });
        navigate(`/${folderName}/${folderId}/${fileId}`);
    }

    const handleOptions = (type: MoreEnum) => {
        switch (type) {
            case MoreEnum.Favorites:
                mutation.mutate({ isFavorite: !data.isFavorite });
                break
            case MoreEnum.Archived:
                mutation.mutate({ isArchived: !data.isArchived });
                break;
            default:
                deleteMutation.mutate();
                break;
        }
    }

    const options: option[] = [
        { id: 0, logo: data && data.isFavorite ? '/logos/star-filled.svg' : '/logos/favorite.svg', text: data && data.isFavorite ? 'Remove from favorites' : 'Add to favorites', alt: 'favorite' },
        { id: 1, logo: data && data.isArchived ? '/logos/archived-filled.svg' : '/logos/archive.svg', text: data && data.isArchived ? 'Remove from Archived' : 'Archive', alt: 'archive' },
        { id: 2, logo: '/logos/delete.svg', text: 'Delete', alt: 'delete' },
    ]

    const handleRestore = (foldName: string, foldId: string) => {
        restoreMutation.mutate({ foldName, foldId });
    }

    if (isLoading) return <NoteSkeleton />

    if (isError) return <p className="text-white">{(error as Error).message}</p>

    return (<div className="bg-background flex-grow min-w-2xl">
        {fileId ? data.deletedAt ? <div className="flex flex-col gap-2.5 h-screen justify-center items-center">
            <img src="/logos/restore.svg" alt="restore-logo" width='80' height='80' />
            <p className="font-semibold text-2xl text-white">Restore &quot;{data.title}&quot;</p>
            <p className="text-center leading-6 w-2/5 text-base text-white/60">Don't want to lose this note? It's not too late! Just click the 'Restore' button and it will be added back to your list. It's that simple.</p>
            <Button variant='default' className="cursor-pointer rounded-md px-7 py-2 bg-primary-blue text-base text-white" onClick={() => handleRestore(data.folder.name, data.folder.id)}>Restore</Button>
        </div> : < div className="p-12 flex flex-col gap-7">
            <div className="flex justify-between">
                <Input type="text" id='name' name="name" style={{ fontSize: '30px' }} className="w-1/3 p-0 border-none font-semibold text-white" onBlur={handleNoteNameBlur} value={noteName} onChange={(e) => setNoteName(e.target.value)} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="focus:ring-0 underline text-sm font-semibold text-white cursor-pointer" variant="link">
                            <img src="/logos/dots.svg" alt="dots-logo" width='30' height='30' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="left" className="text-white p-3.5 -left-48 flex flex-col gap-5 top-3 absolute border-0 h-40 bg-tertiary rounded-md overflow-y-scroll">
                        {options.map((option: option) => <DropdownMenuCheckboxItem
                            key={option.id}
                            className="text-base flex flex-col items-start cursor-pointer p-0"
                        >
                            {option.id === options.length - 1 && <DropdownMenuSeparator className="bg-white/5 w-full" />}
                            <div className="flex gap-3.5" onClick={() => handleOptions(MoreValue[option.id])}>
                                <img src={option.logo} alt={option.alt} width='20' height='20' />
                                <p className="w-48">{option.text}</p>
                            </div>
                        </DropdownMenuCheckboxItem>)}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-col gap-3.5">
                <div className="flex gap-5 items-center">
                    <CalendarDays size={18} strokeWidth={2.5} className="text-white/60" />
                    <span className="text-sm font-semibold text-white/60 w-20">Date</span>
                    <span className="underline text-sm font-semibold text-white">{formatDate(data.createdAt) || '--'}</span>
                </div>
                <hr className="text-white/60" />
                <div className="flex gap-5 items-center">
                    <FolderIcon size={18} className="text-white/60" strokeWidth={2.5} />
                    <span className="text-sm font-semibold text-white/60 w-20">Folder</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button disabled={isMore} className="p-0 focus:ring-0 underline text-sm font-semibold text-white cursor-pointer" variant="link">{data.folder.name || '--'}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="text-white -left-7 absolute border-0 h-60 w-60 bg-tertiary rounded-md overflow-y-scroll">
                            {folders && folders.map((item: Folder) => <DropdownMenuCheckboxItem
                                key={item.id}
                                checked={item.id === data.folder.id}
                                className="text-base font-semibold cursor-pointer hover:bg-[var(--primary-blue)]"
                                onClick={() => handleFolderChange(item.id, item.name)}
                            >
                                {item.name || '--'}
                            </DropdownMenuCheckboxItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <textarea
                    id="content"
                    name="content"
                    className="outline-0 text-white w-full h-[525px] p-2"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    onBlur={handleNoteContentBlur}
                />
            </div>
        </div> : <div className="h-screen flex flex-col gap-2.5 items-center justify-center">
            <FileText size={80} className="text-white" />
            <p className="font-semibold text-2xl text-white text-center">Select a note to view</p>
            <p className="text-white/60 text-base text-center w-5/12">Choose a note from the list on the left to view its contents, or create a new note to add to your collection.</p>        </div>
        }
    </div >)
}