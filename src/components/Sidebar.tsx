import { useSidebar } from "../contexts/SidebarContext";
import data from '../data/data.json'
import BoardList from "./BoardList"
import iconBoard from '../assets/icon-board.svg'
import iconLight from '../assets/icon-light-theme.svg'
import iconDark from '../assets/icon-dark-theme.svg'


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
                className="sidebar-modal flex flex-col  mt-4  bg-white rounded-lg shadow-lg"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <p className="pl-6 mt-4 text-medium-grey font-bold text-xs tracking-[2.4px]">ALL BOARDS (21)</p>

                <BoardList boards={data.boards} />

                <div className="theme-toggle-container mx-4 my-4 w-[235px] h-12 bg-light-bg rounded-md flex justify-center items-center gap-6">
                    <img src={iconLight} alt="" />
                    toggle switch
                    <img src={iconDark} alt="" />
                </div>

            </div>
        </div>
    );
}
