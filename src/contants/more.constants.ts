import type { moreType } from "@/interfaces/more.interface";
import { MoreEnum } from "@/lib/more.enums";
import { Archive, Star, Trash } from "lucide-react";

export const moreOptions:moreType[] = [
    {id:1,label:'Favorites',logo:Star,type:MoreEnum.Favorites},
    {id:2,label:'Trash',logo:Trash,type:MoreEnum.Trash},
    {id:3,label:'Archived Notes',logo:Archive,type:MoreEnum.Archived},
]