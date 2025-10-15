import { useState } from 'react'
import logoMobile from '../assets/logo-mobile.svg'
import logoLight from "../assets/logo-light.svg"
import iconChevDown from '../assets/icon-chevron-down.svg'
import iconChevUp from '../assets/icon-chevron-up.svg'
import iconAddTask from '../assets/icon-add-task-mobile.svg'
import { useSidebar } from '../contexts/SidebarContext';
import { useBoard } from '../contexts/BoardContext';
import EditBoardModal from './EditBoardModal'
import ConfirmModal from './ConfirmModal'
import TaskFormModal from './TaskFormModal'
import EllipsisMenu from './EllipsisMenu'

export default function Header() {

    const { isOpen, toggle, isHidden } = useSidebar()
    const { selectedBoard, deleteBoard } = useBoard()

    const [editModalOpen, setEditModalOpen] = useState(false)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [taskFormModalOpen, setTaskFormModalOpen] = useState(false)

    return (
        <header className='px-4 h-16 relative bg-white dark:bg-dark-header transition-colors'>
            <nav className='flex items-center h-full'>

                <img src={logoMobile} alt="logo" className="w-6 h-6 mr-4 cursor-pointer md:hidden" />

                {isHidden && (
                    <div className='h-full border-r border-r-dark-lines pr-6 mr-6'>
                        <img
                            src={logoLight}
                            alt="logo"
                            className="hidden md:inline w-[150px] py-4 ml-2 r-12 mb-10"
                        />
                    </div>

                )}

                <div
                    className='flex items-center h-full cursor-pointer md:cursor-default'
                    onClick={toggle}
                >

                    <span className="font-bold text-lg mr-2 md:text-xl">{selectedBoard.name}</span>
                    <img src={isOpen ? iconChevUp : iconChevDown} alt="toggle sidebar icon" className='w-2 h-1.5 md:hidden' />
                </div>

                <div className='ml-auto flex items-center h-full'>
                    <button
                        className='inline-flex items-center justify-center text-sm text-white font-bold bg-main-purple h-10 px-4 rounded-3xl cursor-pointer mr-4 hover:bg-main-purple-hover leading-none'
                        onClick={() => setTaskFormModalOpen(true)}
                    >
                        <img src={iconAddTask} alt="add task icon" className='w-3 h-3 md:hidden' />
                        <span className="hidden md:inline">+ Add New Task</span>
                    </button>


                    <EllipsisMenu
                        items={[
                            {
                                label: "Edit Board",
                                onClick: () => setEditModalOpen(true)
                            },
                            {
                                label: "Delete Board",
                                onClick: () => setDeleteModalOpen(true),
                                danger: true
                            }
                        ]}
                    />

                    {editModalOpen && (
                        <EditBoardModal
                            board={selectedBoard}
                            onClose={() => setEditModalOpen(false)}
                        />
                    )}

                    {deleteModalOpen && (
                        <ConfirmModal
                            title="Delete this board?"
                            message={`Are you sure you want to delete the '${selectedBoard.name}' board? This action will remove all columns and tasks and cannot be reversed.`}
                            danger
                            onConfirm={() => {
                                deleteBoard(selectedBoard.name)
                                setDeleteModalOpen(false)
                            }}
                            onCancel={() => setDeleteModalOpen(false)}
                        />
                    )}

                    {taskFormModalOpen && (
                        <TaskFormModal
                            onClose={() => setTaskFormModalOpen(false)}
                        />
                    )}


                </div>
            </nav>
        </header >
    )
}