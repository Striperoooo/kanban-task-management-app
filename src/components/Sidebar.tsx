import { useSidebar } from "../contexts/SidebarContext";


export default function Sidebar() {
    const { isOpen, close } = useSidebar()

    // Only render modal if sidebarIsOpen
    if (!isOpen) return null;

    return (
        <div
            className="fixed top-[64px] left-0 right-0 bottom-0 z-50 bg-black bg-opacity-40 flex justify-center items-start"
            onClick={close}
        >
            <div
                className="mt-20 w-full max-w-xs bg-white rounded-xl shadow-lg p-4"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <aside>Sidebar Component</aside>
                <button
                    className="mt-4 w-full py-2 rounded bg-main-purple text-white"
                    onClick={close}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
