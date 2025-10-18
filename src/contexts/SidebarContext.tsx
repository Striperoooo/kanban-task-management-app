import { createContext, useContext, useState } from "react";
import type { ReactNode } from 'react';

type SidebarContextType = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    // Desktop hide/show state
    isHidden: boolean;
    hide: () => void;
    show: () => void;
    toggleHidden: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar must be used within SidebarProvider");
    return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggle = () => setIsOpen((prevIsOpen) => !prevIsOpen);
    const hide = () => setIsHidden(true);
    const show = () => setIsHidden(false);
    const toggleHidden = () => setIsHidden(v => !v);

    return (
        <SidebarContext.Provider value={{ isOpen, open, close, toggle, isHidden, hide, show, toggleHidden }}>
            {children}
        </SidebarContext.Provider>
    );
}