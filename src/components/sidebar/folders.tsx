import type { Folder } from "@/interfaces/sidebar.interface";
import { FoldersSkeleton } from "@/skeletons/folder.skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";
import { Folder as FolderIcon, FolderOpen, FolderPlus, Trash, X } from 'lucide-react';
import { MoreEnum } from "@/lib/more.enums";
import { config } from "@/config";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../ui/input";

function checkFolderPresence(folderId: string, folders: Folder[]) {
    return folders.find(folder => folder.id === folderId);
}

export function Folders() {
    const { folderId, folderName } = useParams();
    const navigate = useNavigate();
    const isMore = (folderName === MoreEnum.Favorites || folderName === MoreEnum.Archived || folderName === MoreEnum.Trash);
    const [newFolderName, setNewFolderName] = useState('My New Folder');
    const queryClient = useQueryClient();
    const [createFolder, setCreateFolder] = useState(false);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['folders'],
        queryFn: async () => {
            const res = await axios.get(`${config.base_url}/folders`);
            if (res.data.folders.length > 0 && !checkFolderPresence(folderId || '', res.data.folders) && !isMore) {
                if (folderId && folderName)
                    navigate(`/${folderName}/${folderId}`);
                else
                    navigate('/All Notes');
            }
            return res.data.folders;
        }
    })

    const createMutation = useMutation({
        mutationFn: async (data: { name: string }) => {
            const res = await axios.post(`${config.base_url}/folders`, data);
            return res.data;
        },
        onSuccess: (data: string) => {
            queryClient.invalidateQueries({ queryKey: ["folders"] });
            toast.success(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await axios.delete(`${config.base_url}/folders/${id}`);
            return res.data;
        },
        onSuccess: async (data: string) => {
            await queryClient.invalidateQueries({ queryKey: ["folders"] });
            navigate('/All Notes');
            toast.success(data);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    })

    if (isError) return <p className="text-white">Error: {(error as Error).message}</p>;
    const handleFolder = (id: string, name: string) => {
        navigate(`/${name}/${id}`);
    }

    const handleFolderCreation = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newFolderName) return;
        createMutation.mutate({ name: newFolderName });
        setCreateFolder(false)
    }

    const handleFolderDelete = (id: string) => {
        if (!id) return;
        if (confirm('Are you sure you want to delete this folder?'))
            deleteMutation.mutate(id);
    }

    return <div className="flex flex-col gap-2">
        <div className="px-5 flex justify-between">
            <span className="text-sm font-semibold text-white/60">Folders</span>
            <button className="cursor-pointer" onClick={() => setCreateFolder(!createFolder)}>{createFolder ? <X className="text-white/60" /> : <FolderPlus className="text-white/60" size={20} strokeWidth={2.5} />}</button>
        </div>
        <div className={`px-5 flex items-center gap-3 ${createFolder ? 'block' : 'hidden'}`}>
            <FolderIcon className="w-5 h-5 text-white/60" />
            <form onSubmit={handleFolderCreation}>
                <Input type="text" value={newFolderName} style={{ fontSize: 'medium' }} className='text-white p-1 w-2/3' onChange={(e) => setNewFolderName(e.target.value)} />
            </form>
        </div>
        {isLoading ? <FoldersSkeleton /> : <div className="max-h-44 overflow-y-scroll">
            {data.map((item: Folder) => <div key={item.id} onClick={() => handleFolder(item.id, item.name)} className={`${item.id === folderId && 'bg-white/5'} hover:bg-white/5 flex items-center justify-between cursor-pointer px-5 gap-2`}>
                <div className='py-2.5 flex gap-3.5'>
                    {item.id === folderId ? <FolderOpen size={20} strokeWidth={2.5} className={`${item.id === folderId ? 'text-white' : 'text-white/60'}`} /> : <FolderIcon className="w-5 h-5 text-white/60" />}
                    <span className={`text-base font-semibold ${item.id === folderId ? 'text-white' : 'text-white/60'}`}>{item.name}</span>
                </div>
                <Trash className={`${item.id === folderId ? 'inline-block text-white' : 'hidden'} cursor-pointer w-5 h-5`} onClick={(e) => { e.stopPropagation(); handleFolderDelete(item.id) }} />
            </div>)}
        </div>}
    </div>
}