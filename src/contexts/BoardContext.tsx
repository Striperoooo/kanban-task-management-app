import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Board, Task, KanbanData } from "../types"
import data from "../data/data.json"
import { loadData, saveData, clearData } from "../lib/storage"

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

    // Load initial data using storage helpers (loadData falls back to data.json)
    const initialData: KanbanData = loadData()
    const [boards, setBoards] = useState<Board[]>(initialData.boards ?? data.boards)
    const initialSelectedName = initialData.selectedBoardName ?? initialData.boards?.[0]?.name ?? data.boards[0].name
    const [selectedBoard, setSelectedBoard] = useState<Board>(
        (initialData.boards ?? data.boards).find(b => b.name === initialSelectedName) ?? (initialData.boards ?? data.boards)[0] ?? data.boards[0]
    )

    function addBoard(newBoard: Board) {
        setBoards(prev => {
            const next = [...prev, newBoard]
            // persist change
            try { saveData({ boards: next, selectedBoardName: newBoard.name }) } catch { }
            return next
        })
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
            const nextSelected = filtered[0] ?? data.boards[0]
            try { saveData({ boards: filtered, selectedBoardName: nextSelected.name }) } catch { }
            setSelectedBoard(nextSelected)
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
            try { saveData({ boards: updatedBoards, selectedBoardName: selectedBoard.name }) } catch { }
            return updatedBoards;
        })
    }

    // Persist boards + selectedBoardName whenever boards or selectedBoard changes
    useEffect(() => {
        try {
            saveData({ boards, selectedBoardName: selectedBoard.name })
        } catch {
            // ignore storage errors
        }
    }, [boards, selectedBoard?.name])

    function resetToDefault() {
        try {
            clearData()
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