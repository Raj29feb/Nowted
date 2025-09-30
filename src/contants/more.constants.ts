import type { moreType } from "@/interfaces/more.interface";
import { MoreEnum } from "@/lib/more.enums";

export const moreOptions:moreType[] = [
    {id:1,label:'Favorites',logo:'/logos/favorite.svg',alt:'favorite-logo',type:MoreEnum.Favorites},
    {id:2,label:'Trash',logo:'/logos/delete.svg',alt:'delete-logo',type:MoreEnum.Trash},
    {id:3,label:'Archived Notes',logo:'/logos/archive.svg',alt:'archive-logo',type:MoreEnum.Archived},
]