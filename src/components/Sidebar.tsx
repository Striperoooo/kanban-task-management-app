import { useSidebar } from "../contexts/SidebarContext";
import BoardList from "./BoardList"
import logoLight from "../assets/logo-light.svg"
import logoDark from "../assets/logo-dark.svg"
import { useTheme } from '../contexts/ThemeContext'
import iconLight from '../assets/icon-light-theme.svg'
import iconDark from '../assets/icon-dark-theme.svg'
import iconShow from "../assets/icon-show-sidebar.svg"
import iconHide from "../assets/icon-hide-sidebar.svg"
import ThemeToggle from './ThemeToggle'

export default function Sidebar() {
    const { isOpen, close, isHidden, hide, show } = useSidebar()
    const { theme } = useTheme()
    const logo = theme === 'dark' ? logoLight : logoDark

    return (
        <>
            {/* Desktop sidebar (md+) */}
            <aside
                className={[
                    "hidden md:flex md:flex-col md:min-h-screen bg-white md:border-r md:border-light-lines dark:md:border-dark-lines dark:bg-dark-sidebar transition-all duration-300",
                    isHidden ? "md:w-0 md:opacity-0" : "md:w-[260px] md:opacity-100"
                ].join(' ')}
                // ensure aside itself doesn't overflow the viewport
                style={{ maxHeight: '100vh' }}
            >

                <img
                    src={logo}
                    alt="logo"
                    className="w-[150px] ml-6 mt-7 mb-10"
                />

                <div className="sidebar-container flex flex-col gap-4 flex-1 min-h-0 overflow-auto pb-6">

                    <BoardList />

                    <div className="mt-auto">
                        <div className="theme-toggle-container mx-auto my-4 w-[90%] h-12 bg-light-bg dark:bg-dark-toggle rounded-md flex justify-center items-center gap-6 transition-colors py-3.5 px-4">
                            <img src={iconLight} alt="Light mode" />
                            <ThemeToggle />
                            <img src={iconDark} alt="Dark mode" />
                        </div>

                        <div className="mt-6 px-6">
                            <button
                                onClick={() => hide()}
                                className="hidden md:inline-flex items-center gap-3 text-medium-grey font-bold text-sm"
                            >
                                <img src={iconHide} alt="hide sidebar" />
                                <span>Hide Sidebar</span>
                            </button>
                        </div>
                    </div>

                </div>


            </aside>

            {/* Mobile modal sidebar (overlay covers header) */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-start"
                    onClick={close}
                >
                    <div
                        className="sidebar-modal-container flex flex-col mt-16 bg-white w-[75%] dark:bg-dark-sidebar rounded-lg shadow-lg"
                        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        <BoardList />

                        <div className="theme-toggle-container my-4 w-[85%] mx-auto h-12 bg-light-bg dark:bg-dark-toggle rounded-md flex justify-center items-center gap-6 transition-colors px-4">
                            <img src={iconLight} alt="Light mode" />
                            <ThemeToggle />
                            <img src={iconDark} alt="Dark mode" />
                        </div>

                    </div>
                </div>
            )}

            {/* Show-pill when sidebar is hidden (md+) */}
            {isHidden && (
                <button
                    onClick={() => show()}
                    className="hidden md:flex items-center justify-center fixed w-16 pl-3 -left-5 bottom-6 z-50 bg-main-purple text-white rounded-full h-10 w-12 shadow-lg transition-all duration-300 ease-in-out hover:bg-main-purple-hover"
                    aria-label="Show sidebar"
                >
                    <img src={iconShow} alt="show sidebar" className="w-4 h-3" />
                </button>
            )}
        </>
    );
}
