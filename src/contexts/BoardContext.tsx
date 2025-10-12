import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
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
    moveTask: (columnName: string, taskTitle: string, toIndex: number) => void
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

    // Ensure every board has an id. If an id is missing, generate one using a simple prefix + index.
    function ensureBoardIds(inputBoards: Board[]) {
        return inputBoards.map((b, i) => ({ id: b.id ?? `board-${i}`, ...b }))
    }

    const seeded = ensureBoardIds(initialData.boards ?? data.boards)

    const [boards, setBoards] = useState<Board[]>(seeded)

    const initialSelectedId = initialData.selectedBoardId ?? seeded[0]?.id ?? seeded[0]?.name ?? data.boards[0].name
    const [selectedBoardId, setSelectedBoardId] = useState<string>(initialSelectedId)

    // wrapper: accept a Board object (old API) and set the selectedBoardId
    function setSelectedBoard(board: Board) {
        if (!board || !board.id) return
        setSelectedBoardId(board.id)
    }

    // derive the selected board object from boards and the selected id
    const selectedBoard = boards.find(b => b.id === selectedBoardId) ?? boards[0]

    function addBoard(newBoard: Board) {
        const boardWithId = { id: newBoard.id ?? `board-${Date.now()}`, ...newBoard }
        setBoards(prev => {
            const next = [...prev, boardWithId]
            // persist change
            try { saveData({ boards: next, selectedBoardId: boardWithId.id }) } catch { }
            return next
        })
        setSelectedBoard(boardWithId)
    }

    function updateBoard(updatedBoard: Board) {
        setBoards(prevBoards =>
            prevBoards.map(b =>
                // allow older callers that passed originalName; fall back to id if provided
                b.name === (updatedBoard as any).originalName
                    ? { ...updatedBoard, name: updatedBoard.name }
                    : b
            )
        )
    }

    function deleteBoard(boardName: string) {
        setBoards(prev => {
            const filtered = prev.filter(b => b.name !== boardName)
            const nextSelected = filtered[0] ?? data.boards[0]
            try { saveData({ boards: filtered, selectedBoardId: nextSelected.id ?? `board-0` }) } catch { }
            setSelectedBoard(nextSelected)
            return filtered
        })
    }

    function addTask(columnName: string, newtask: Task) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board =>
                board.id === selectedBoardId
                    ? {
                        ...board,
                        columns: (board.columns ?? []).map(col =>
                            col.name === columnName
                                ? { ...col, tasks: [...(col.tasks ?? []), newtask] }
                                : col
                        )
                    }
                    : board
            )

            const updatedSelected = updatedBoards.find(b => b.id === selectedBoardId);
            if (updatedSelected) {
                setSelectedBoard(updatedSelected)
            };
            try { saveData({ boards: updatedBoards, selectedBoardId }) } catch { }
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
                if (board.id !== selectedBoardId) return board;

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
            const updatedSelected = updatedBoards.find(b => b.id === selectedBoardId);
            if (updatedSelected) setSelectedBoard(updatedSelected);
            return updatedBoards;
        });
    }

    function deleteTask(columnName: string, title: string) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.id !== selectedBoardId) return board;

                return {
                    ...board,
                    columns: (board.columns ?? []).map(col =>
                        col.name === columnName
                            ? { ...col, tasks: (col.tasks ?? []).filter(t => t.title !== title) }
                            : col
                    )
                }
            })
            const updatedSelected = updatedBoards.find(b => b.id === selectedBoardId);
            if (updatedSelected) setSelectedBoard(updatedSelected);
            try { saveData({ boards: updatedBoards, selectedBoardId }) } catch { }
            return updatedBoards;
        })
    }

    function moveTask(columnName: string, taskTitle: string, toIndex: number) {
        setBoards(prev => {
            const copy = prev.map(b => ({ ...b, columns: b.columns ? b.columns.map(c => ({ ...c, tasks: c.tasks ? [...c.tasks] : [] })) : [] }))
            const board = copy.find(b => b.name === selectedBoard.name)!
            const column = board.columns!.find(c => c.name === columnName)!
            const fromIndex = column.tasks!.findIndex(t => t.title === taskTitle)
            if (fromIndex === -1) return prev
            const [moved] = column.tasks!.splice(fromIndex, 1)
            column.tasks!.splice(toIndex, 0, moved)
            // persist
            saveData({ boards: copy, selectedBoardId })
            return copy
        })
    }

    // Persist boards + selectedBoardName whenever boards or selectedBoard changes
    useEffect(() => {
        try {
            saveData({ boards, selectedBoardId })
        } catch {
            // ignore storage errors
        }
    }, [boards, selectedBoardId])

    function resetToDefault() {
        try {
            clearData()
        } catch {

        }
        const reset = ensureBoardIds(data.boards)
        setBoards(reset)
        setSelectedBoard(reset[0])
    }

    function toggleSubtask(columnName: string, taskTitle: string, subtaskIndex: number) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.id !== selectedBoardId) return board;

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

            const updatedSelected = updatedBoards.find(b => b.id === selectedBoardId);
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
                    toggleSubtask,
                    moveTask,
                    resetToDefault
            }}
        >
            {children}
        </BoardContext.Provider>
    )
}