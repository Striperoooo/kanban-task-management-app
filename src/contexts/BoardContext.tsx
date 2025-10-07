import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Board, Task } from "../types"
import data from "../data/data.json"

type BoardContextType = {
    selectedBoard: Board
    setSelectedBoard: (board: Board) => void
    boards: Board[]
    addBoard: (board: Board) => void
    updateBoard: (board: Board) => void
    deleteBoard: (boardName: string) => void
    addTask: (columnName: string, newtask: Task) => void
}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within BoardProvider")
    return context
}

export function BoardProvider({ children }: { children: ReactNode }) {
    const [selectedBoard, setSelectedBoard] = useState<Board>(data.boards[0])
    const [boards, setBoards] = useState<Board[]>(data.boards)

    function addBoard(newBoard: Board) {
        setBoards(prev => [...prev, newBoard])
        setSelectedBoard(newBoard)
    }

    function updateBoard(updatedBoard: Board) {
        setBoards(prevBoards =>
            prevBoards.map(b =>
                b.name === updatedBoard.originalName
                    ? { ...updatedBoard, name: updatedBoard.name }
                    : b
            )
        )
    }

    function deleteBoard(boardName: string) {
        setBoards(prev => {
            const filtered = prev.filter(b => b.name !== boardName)
            setSelectedBoard(filtered[0] || null)
            return filtered
        })
    }

    function addTask(columnName: string, newtask: Task) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board =>
                board.name === selectedBoard.name
                    ? {
                        ...board,
                        columns: board.columns.map(col =>
                            col.name === columnName
                                ? { ...col, tasks: [...(col.tasks ?? []), newtask] }
                                : col
                        )
                    }
                    : board
            )

            const updatedSelected = updatedBoards.find(b => b.name === selectedBoard.name);
            if (updatedSelected) {
                setSelectedBoard(updatedSelected)
            };
            return updatedBoards;

        })
    }

    return (
        <BoardContext.Provider
            value={{
                selectedBoard,
                setSelectedBoard,
                boards,
                addBoard,
                updateBoard,
                deleteBoard,
                addTask
            }}
        >
            {children}
        </BoardContext.Provider>
    )
}