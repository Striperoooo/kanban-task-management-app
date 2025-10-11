import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    editTask: (columnName: string, updatedTask: Task, originalTitle: string) => void
    deleteTask: (columnName: string, title: string) => void
    toggleSubtask: (columnName: string, taskTitle: string, subtaskIndex: number) => void

}

const BoardContext = createContext<BoardContextType | undefined>(undefined)

export function useBoard() {
    const context = useContext(BoardContext)
    if (!context) throw new Error("useBoard must be used within BoardProvider")
    return context
}

export function BoardProvider({ children }: { children: ReactNode }) {

    const STORAGE_KEY = "kanban.boards"
    const SELECTED_KEY = "kanban.selectedBoard"

    // const [selectedBoard, setSelectedBoard] = useState<Board>(data.boards[0])
    // const [boards, setBoards] = useState<Board[]>(data.boards)

    const initialBoards = (() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw
                ? (JSON.parse(raw) as Board[])
                : data.boards
        } catch {
            return data.boards
        }
    })()

    const [boards, setBoards] = useState<Board[]>(initialBoards)

    const initialSelectedName = (() => {
        try {
            const raw = localStorage.getItem(SELECTED_KEY)
            if (raw && initialBoards.some(b => b.name === raw)) return raw
        } catch {
            // ignore
        }
        return initialBoards[0]?.name ?? data.boards[0].name
    })()

    const [selectedBoard, setSelectedBoard] = useState<Board>(
        initialBoards.find(b => b.name === initialSelectedName) ?? initialBoards[0] ?? data.boards[0]
    )

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
            setSelectedBoard(filtered[0] ?? data.boards[0])
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

    function editTask(
        columnName: string,
        updatedTask: Task,
        originalTitle: string
    ) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.name !== selectedBoard.name) return board;

                const originalColumnName = columnName;
                const targetColumnName = updatedTask.status;

                // If column didn't change, replace the task in-place
                if (originalColumnName === targetColumnName) {
                    return {
                        ...board,
                        columns: (board.columns ?? []).map(col =>
                            col.name === originalColumnName
                                ? {
                                    ...col,
                                    tasks: (col.tasks ?? []).map(task =>
                                        task.title === originalTitle ? { ...updatedTask } : task
                                    )
                                }
                                : col
                        )
                    };
                }

                // If column changed, remove from original and add to target
                return {
                    ...board,
                    columns: (board.columns ?? []).map(col => {
                        if (col.name === originalColumnName) {
                            return {
                                ...col,
                                tasks: (col.tasks ?? []).filter(task => task.title !== originalTitle)
                            };
                        }

                        if (col.name === targetColumnName) {
                            return {
                                ...col,
                                tasks: [...(col.tasks ?? []), updatedTask]
                            };
                        }

                        return col;
                    })
                };
            });
            const updatedSelected = updatedBoards.find(b => b.name === selectedBoard.name);
            if (updatedSelected) setSelectedBoard(updatedSelected);
            return updatedBoards;
        });
    }

    function deleteTask(columnName: string, title: string) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.name !== selectedBoard.name) return board;

                return {
                    ...board,
                    columns: (board.columns ?? []).map(col =>
                        col.name === columnName
                            ? { ...col, tasks: (col.tasks ?? []).filter(t => t.title !== title) }
                            : col
                    )
                }
            })

            const updatedSelected = updatedBoards.find(b => b.name === selectedBoard.name);
            if (updatedSelected) setSelectedBoard(updatedSelected);
            return updatedBoards;
        })
    }

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
        } catch {

        }
    }, [boards])

    // save currently selected board name so we can restore it after reload
    useEffect(() => {
        try {
            localStorage.setItem(SELECTED_KEY, selectedBoard.name)
        } catch {
            // ignore storage errors
        }
    }, [selectedBoard?.name])

    function resetToDefault() {
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch {

        }
        setBoards(data.boards)
        setSelectedBoard(data.boards[0])
    }

    function toggleSubtask(columnName: string, taskTitle: string, subtaskIndex: number) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.name !== selectedBoard.name) return board;

                return {
                    ...board,
                    columns: (board.columns ?? []).map(col => {
                        if (col.name !== columnName) return col;

                        return {
                            ...col,
                            tasks: (col.tasks ?? []).map(task => {
                                if (task.title !== taskTitle) return task;

                                const newSubtasks = (task.subtasks ?? []).map((st, i) =>
                                    i === subtaskIndex ? { ...st, isCompleted: !st.isCompleted } : st
                                );

                                return { ...task, subtasks: newSubtasks };
                            })
                        };
                    })
                };
            });

            const updatedSelected = updatedBoards.find(b => b.name === selectedBoard.name);
            if (updatedSelected) setSelectedBoard(updatedSelected);
            return updatedBoards;
        });
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
                addTask,
                editTask
                ,
                deleteTask,
                toggleSubtask
            }}
        >
            {children}
        </BoardContext.Provider>
    )
}