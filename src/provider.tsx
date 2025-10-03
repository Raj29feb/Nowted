import { useState, type ReactNode } from "react";
import { PageContext } from "./context";

interface PageProviderProps {
    children: ReactNode;
}

export function PageProvider({ children }: PageProviderProps) {
    const [page, setPage] = useState(1);

    return (
        <PageContext.Provider value={{ page, setPage }}>
            {children}
        </PageContext.Provider>
    );
}
