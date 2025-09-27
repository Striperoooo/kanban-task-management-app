



export default function Sidebar({ sidebarIsOpen, handleSidebarClose }: { sidebarIsOpen: boolean, handleSidebarClose: () => void }) {
    // Only render modal if sidebarIsOpen
    if (!sidebarIsOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-start"
            onClick={handleSidebarClose}
        >
            <div
                className="mt-20 w-full max-w-xs bg-white rounded-xl shadow-lg p-4"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <aside>Sidebar Component</aside>
                <button
                    className="mt-4 w-full py-2 rounded bg-main-purple text-white"
                    onClick={handleSidebarClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}
