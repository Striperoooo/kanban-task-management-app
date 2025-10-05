import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Board } from "../types"
import data from "../data/data.json"

type BoardContextType = {
    selectedBoard: Board
    setSelectedBoard: (board: Board) => void
    boards: Board[]
    addBoard: (board: Board) => void
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

    return (
        <BoardContext.Provider
            value={{
                selectedBoard,
                setSelectedBoard,
                boards,
                addBoard
            }}
        >
            {children}
        </BoardContext.Provider>
    )
}

