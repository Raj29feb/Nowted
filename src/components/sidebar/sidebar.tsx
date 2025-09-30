
import { Folders } from "./folders";
import { More } from "./More";
import { Recent } from "./recent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { config } from "@/config";
import { useState } from "react";
import { Search, X } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import type { Note } from "@/interfaces/sidebar.interface";
import { useDebounce } from "@/custom-hook/debounce";
import { Skeleton } from "../ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";


export function Sidebar() {
    const { folderId, folderName } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 1000);
    const [searchNote, setSearchNote] = useState(false);

    const mutation = useMutation({
        mutationFn: async () => {
            const newNote = {
                folderId: folderId,
                title: 'New Note',
                content: "",
                isFavorite: false,
                isArchived: false
            };
            const res = await axios.post(`${config.base_url}/notes`, newNote);
            return res.data;
        },
        onSuccess: (data: { id: string }) => {
            navigate(`/${folderName}/${folderId}/New Note/${data.id}`);
            queryClient.invalidateQueries({ queryKey: ["selectedFolder"] });
            queryClient.invalidateQueries({ queryKey: ["recentNotes"] });
            toast.success('New post created successfully');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const handleNewNote = () => {
        if (!folderId) return;
        mutation.mutate();
    };
    const handleSearch = (filId: string, filName: string, folId: string, folName: string) => {
        navigate(`/${folName}/${folId}/${filName}/${filId}`);
    }
    return (
        <div className="py-7 flex flex-col gap-7 bg-background min-w-2xs">
            <div className="px-5 flex justify-between">
                <img src="/logos/nowted.svg" width='101' height='38' />
                <button className="cursor-pointer text-white/30" onClick={() => {
                    setSearchNote(!searchNote);
                    setSearch('');
                }}>{searchNote ? <X className="w-6 h-6" /> : <Search strokeWidth={3} className="h-5 w-5" />}</button>
            </div>
            <div className="px-5 flex gap-2">
                {searchNote ? <Command className="rounded-sm text-white/60 font-semibold text-base">
                    <CommandInput className="text-base" placeholder="Search note" onValueChange={(val) => setSearch(val)} />
                    <CommandList className="bg-background-tertiary rounded-sm absolute z-10 w-64">
                        <SearchDropdown search={debouncedSearch} handleSearch={handleSearch} />
                    </CommandList>
                </Command> : <button className="p-2.5 flex gap-2 cursor-pointer w-full bg-white/3 justify-center rounded-sm items-center" onClick={handleNewNote}>
                    <img src="/logos/plus.svg" width='20' height='20' />
                    <span className="text-center text-base font-semibold text-white">New Note</span>{/*font family needs to be fixed*/}
                </button>}
            </div>
            <Recent />
            <Folders />
            <More />
        </div>
    )
}
function SearchDropdown({ search, handleSearch }: { search: string, handleSearch: (filId: string, filName: string, folId: string, folName: string) => void }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["notes", search],
        queryFn: async () => {
            const res = await axios.get(`${config.base_url}/notes`, {
                params: { search, deleted: false },
            });
            return res.data.notes;
        }
    });
    if (isLoading) {
        return <CommandGroup>
            {[...Array(5)].map((_, idx) => (
                <CommandItem key={idx}>
                    <Skeleton className="h-4 w-full rounded-sm bg-white/60" />
                </CommandItem>
            ))}
        </CommandGroup>
    }
    if (isError) {
        return <p>{(error as Error).message}</p>
    }
    return <>
        <CommandEmpty>No results found.</CommandEmpty>
        {data && data.length > 0 && <CommandGroup>
            {data.map((item: Note) => <CommandItem key={item.id} onSelect={() => handleSearch(item.id, item.title, item.folderId, item.folder.name)} className="cursor-pointer text-base hover:bg-[var(--primary-blue)]">{item.title}</CommandItem>)}
        </CommandGroup>}
    </>
}