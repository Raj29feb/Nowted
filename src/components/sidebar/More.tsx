import type { moreType } from "@/interfaces/more.interface";
import { moreOptions } from "@/contants/more.constants";
import { MoreEnum } from "@/lib/more.enums";
import { useNavigate, useParams } from "react-router-dom";
export function More() {
    const { folderName } = useParams();
    const navigate = useNavigate();
    function handleMore(type: MoreEnum) {
        switch (type) {
            case MoreEnum.Favorites:
                navigate(`/${MoreEnum.Favorites}`);
                break;
            case MoreEnum.Trash:
                navigate(`/${MoreEnum.Trash}`);
                break;
            case MoreEnum.Archived:
                navigate(`/${MoreEnum.Archived}`);
                break;
        }
    }
    return <div className="flex flex-col gap-2">
        <p className="px-5 text-white/60 text-sm font-semibold">More</p>
        <div className="flex flex-col gap-1.5">
            {moreOptions.map((item: moreType) => <div key={item.id} className={`${item.label === folderName ? 'bg-white/5' : 'hover:bg-white/5'} cursor-pointer flex px-5 py-2.5 gap-3.5`} onClick={() => handleMore(item.type)}>
                <item.logo className="text-white/60" size={20} strokeWidth={2.5} />
                <span className="text-base font-semibold text-white/60">{item.label}</span>
            </div>)}
        </div>
    </div>
}