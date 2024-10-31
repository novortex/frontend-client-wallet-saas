import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

export function Layout({ children }: { children: ReactNode }) {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    )
}