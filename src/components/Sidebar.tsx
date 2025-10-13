import { useSidebar } from "../contexts/SidebarContext";
import BoardList from "./BoardList"
import iconLight from '../assets/icon-light-theme.svg'
import iconDark from '../assets/icon-dark-theme.svg'
import ThemeToggle from './ThemeToggle'


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
                className="sidebar-modal-container flex flex-col mt-4  bg-white dark:bg-dark-sidebar rounded-lg shadow-lg"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >

                <BoardList />

                <div className="theme-toggle-container mx-4 my-4 w-[235px] h-12 bg-light-bg dark:bg-dark-toggle rounded-md flex justify-center items-center gap-6 transition-colors">
                    <img src={iconLight} alt="Light mode" />
                    <ThemeToggle />
                    <img src={iconDark} alt="Dark mode" />
                </div>

            </div>
        </div>
    );
}
