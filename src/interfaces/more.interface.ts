import type { MoreEnum } from "@/lib/more.enums";
import type { LucideIcon } from "lucide-react";

export interface moreType{
    id:number,
    label:string,
    logo:LucideIcon,
    type:MoreEnum
}