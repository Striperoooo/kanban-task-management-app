import { useState } from 'react'
import logoMobile from '../assets/logo-mobile.svg'
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

    const { isOpen, toggle } = useSidebar()
    const { selectedBoard, deleteBoard } = useBoard()

    const [editModalOpen, setEditModalOpen] = useState(false)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [taskFormModalOpen, setTaskFormModalOpen] = useState(false)

    return (
        <header className='py-4 px-4 h-16 relative bg-white dark:bg-dark-header transition-colors'>
            <nav className='flex items-center'>
                <img src={logoMobile} alt="logo" className="w-6 h-25 mr-4 cursor-pointer" />

                <div
                    className='flex items-center cursor-pointer'
                    onClick={toggle}
                >
                    <span className="font-bold text-lg mr-2">{selectedBoard.name}</span>
                    <img src={isOpen ? iconChevUp : iconChevDown} alt="toggle sidebar icon" className='mt-1 w-2 h-1.5' />
                </div>

                <div className='ml-auto flex items-center'>
                    <button
                        className='bg-main-purple py-2.5 px-[18px] rounded-3xl cursor-pointer mr-4 hover:bg-main-purple-hover'
                        onClick={() => setTaskFormModalOpen(true)}
                    >
                        <img src={iconAddTask} alt="add task icon" className='w-3 h-3' />
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
        </header>
    )
}