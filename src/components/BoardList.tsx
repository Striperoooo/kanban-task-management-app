import { useState } from 'react';
import { useBoard } from '../contexts/BoardContext';
import AddBoardModal from './AddBoardModal';

export default function BoardList() {
    const { boards, selectedBoard, setSelectedBoard } = useBoard()
    const [showBoardModal, setShowBoardModal] = useState(false)

    return (
        <>
            <p className="text-heading pl-6 mt-4 text-medium-grey font-bold text-xs tracking-[2.4px]">ALL BOARDS ({boards.length})</p>

            <div className="kanban-boards-container mt-4 pl-6">
                {boards.map((board) => {
                    const isSelected = board.name === selectedBoard.name
                    return (
                        <div
                            key={board.name}
                            className={
                                [
                                    "group flex text-[15px] font-bold items-center py-3.5 gap-3 cursor-pointer",
                                    "rounded-tr-full rounded-br-full -ml-6 mr-6",
                                    isSelected
                                        ? "bg-main-purple text-white"
                                        : "text-medium-grey hover:bg-main-purple-second-hover hover:text-main-purple",
                                ].join(" ")
                            }
                            onClick={() => setSelectedBoard(board)}
                        >
                            <div className="pl-6 flex items-center gap-3">
                                <svg
                                    className={
                                        isSelected
                                            ? "w-4 h-4 text-white"
                                            : "w-4 h-4 text-medium-grey group-hover:text-main-purple"
                                    }
                                    viewBox="0 0 17 16"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" fill="currentColor" />
                                </svg>
                                <p>{board.name}</p>
                            </div>
                        </div>
                    )

                })}

                <button
                    className="create-board-btn group flex w-full text-main-purple text-[15px] font-bold items-center py-3.5 gap-3 cursor-pointer rounded-tr-full rounded-br-full -ml-6 mr-6 hover:bg-main-purple-second-hover hover:text-main-purple"
                    onClick={() => setShowBoardModal(true)}
                >
                    <div className="pl-6 flex items-center gap-3">
                        <svg
                            className="w-4 h-4 text-main-purple"
                            viewBox="0 0 17 16"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 2.889A2.889 2.889 0 0 1 2.889 0H13.11A2.889 2.889 0 0 1 16 2.889V13.11A2.888 2.888 0 0 1 13.111 16H2.89A2.889 2.889 0 0 1 0 13.111V2.89Zm1.333 5.555v4.667c0 .859.697 1.556 1.556 1.556h6.889V8.444H1.333Zm8.445-1.333V1.333h-6.89A1.556 1.556 0 0 0 1.334 2.89V7.11h8.445Zm4.889-1.333H11.11v4.444h3.556V5.778Zm0 5.778H11.11v3.11h2a1.556 1.556 0 0 0 1.556-1.555v-1.555Zm0-7.112V2.89a1.555 1.555 0 0 0-1.556-1.556h-2v3.111h3.556Z" fill="currentColor" />
                        </svg>
                        <p>+ Create New Board</p>
                    </div>
                </button>

            </div >

            {showBoardModal && (
                <AddBoardModal onClose={() => setShowBoardModal(false)} />
            )}

        </>
    )
}

