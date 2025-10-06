import { useState } from 'react'
import logoMobile from '../assets/logo-mobile.svg'
import iconChevDown from '../assets/icon-chevron-down.svg'
import iconChevUp from '../assets/icon-chevron-up.svg'
import iconAddTask from '../assets/icon-add-task-mobile.svg'
import iconEllipsis from '../assets/icon-vertical-ellipsis.svg'
import { useSidebar } from '../contexts/SidebarContext';
import { useBoard } from '../contexts/BoardContext';
import EditBoardModal from './EditBoardModal'

export default function Header() {

    const { isOpen, toggle, close } = useSidebar()
    const { selectedBoard } = useBoard()

    const [menuOpen, setMenuOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)

    return (
        <header className='py-4 px-4 h-16 relative'>
            <nav className='flex items-center'>
                <img src={logoMobile} alt="logo" className="w-6 h-25 mr-4 cursor-pointer" />

                <div
                    className='flex items-center cursor-pointer'
                    onClick={toggle}
                >
                    <span className="font-bold text-lg mr-2">{selectedBoard.name}</span>
                    <img src={isOpen ? iconChevUp : iconChevDown} alt="toggle sidebar icon" className='mt-1 w-2 h-1.5' />
                </div>

                <div className='ml-auto flex'>
                    <div className='bg-main-purple py-2.5 px-[18px] rounded-3xl cursor-pointer mr-4'>
                        <img src={iconAddTask} alt="add task icon" className='w-3 h-3' />
                    </div>
                    <div className='relative'>
                        <div
                            className='inline-flex items-center justify-center p-1 -m-1 cursor-pointer'
                            onClick={() => setMenuOpen(v => !v)}
                        >
                            <img src={iconEllipsis} alt="ellipsis icon" className='h-3' />
                        </div>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded z-50">
                                <button
                                    className="font-medium text-medium-grey text-[13px] leading-[23px] block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => { setEditModalOpen(true); setMenuOpen(false); }}
                                >
                                    Edit Board
                                </button>
                                <button
                                    className="font-medium text-[#EA5555] text-[13px] leading-[23px] block w-full text-left px-4 py-2 hover:bg-gray-100"
                                // onClick={...} // For delete, implement later
                                >
                                    Delete Board
                                </button>
                            </div>
                        )}
                        {editModalOpen && (
                            <EditBoardModal
                                board={selectedBoard}
                                onClose={() => setEditModalOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}