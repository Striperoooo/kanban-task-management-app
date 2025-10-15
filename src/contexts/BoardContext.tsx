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
    addTask: (columnId: string, newtask: Task) => void
    editTask: (originalColumnId: string, updatedTask: Task, originalTaskId: string) => void
    deleteTask: (columnId: string, taskId: string) => void
    moveTask: (fromColumnId: string, toColumnId: string, taskId: string, toIndex: number, persist?: boolean) => void
    toggleSubtask: (columnId: string, taskId: string, subtaskIndex: number) => void
    resetToDefault: () => void

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
    // Ensure boards, columns and tasks have stable ids and normalize task.status to column ids when possible
    function ensureIds(inputBoards: Board[]) {
        return inputBoards.map((b, bi) => {
            const boardId = b.id ?? `board-${bi}`
            const columns = (b.columns ?? []).map((c, ci) => {
                const colId = c.id ?? `${boardId}-col-${ci}`
                const tasks = (c.tasks ?? []).map((t, ti) => {
                    const taskId = t.id ?? `${colId}-task-${ti}`
                    // normalize status: if status matches a column name, replace with the column id
                    const status = (() => {
                        if (!t.status) return colId
                        const matched = (b.columns ?? []).find(x => x.name === t.status)
                        return matched ? (matched.id ?? `${boardId}-col-${(b.columns ?? []).indexOf(matched)}`) : t.status
                    })()
                    return { id: taskId, ...t, status }
                })
                return { id: colId, ...c, tasks }
            })
            return { id: boardId, ...b, columns }
        })
    }

    const seeded = ensureIds(initialData.boards ?? data.boards)

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
        // Generate a unique id for the new board so columns/tasks are namespaced correctly
        const uniqueBoardId = `board-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        // Ensure ids for the new board and its descendants using the generated id
        const normalized = ensureIds([{ ...newBoard, id: uniqueBoardId }])[0]
        const boardWithId = { ...normalized }
        // Append and set selected board id directly
        const next = [...boards, boardWithId]
        setBoards(next)
        setSelectedBoardId(boardWithId.id)
        try { saveData({ boards: next, selectedBoardId: boardWithId.id }) } catch { }
        // debug
        console.log('[BoardContext] addBoard:', boardWithId, 'boards now:', next.length)
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

    function addTask(columnId: string, newtask: Task) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board =>
                board.id === selectedBoardId
                    ? {
                        ...board,
                        columns: (board.columns ?? []).map(col =>
                            col.id === columnId
                                ? { ...col, tasks: [...(col.tasks ?? []), { id: newtask.id ?? `task-${Date.now()}`, ...newtask }] }
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
        originalColumnId: string,
        updatedTask: Task,
        originalTaskId: string
    ) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.id !== selectedBoardId) return board;
                const targetColumnId = updatedTask.status;

                // If column didn't change, replace the task in-place
                if (originalColumnId === targetColumnId) {
                    return {
                        ...board,
                        columns: (board.columns ?? []).map(col =>
                            col.id === originalColumnId
                                ? {
                                    ...col,
                                    tasks: (col.tasks ?? []).map(task =>
                                        task.id === originalTaskId ? { ...task, ...updatedTask } : task
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
                        if (col.id === originalColumnId) {
                            return {
                                ...col,
                                tasks: (col.tasks ?? []).filter(task => task.id !== originalTaskId)
                            };
                        }

                        if (col.id === targetColumnId) {
                            return {
                                ...col,
                                tasks: [...(col.tasks ?? []), { id: updatedTask.id ?? originalTaskId, ...updatedTask }]
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

    function deleteTask(columnId: string, taskId: string) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.id !== selectedBoardId) return board;

                return {
                    ...board,
                    columns: (board.columns ?? []).map(col =>
                        col.id === columnId
                            ? { ...col, tasks: (col.tasks ?? []).filter(t => t.id !== taskId) }
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

    function moveTask(fromColumnId: string, toColumnId: string, taskId: string, toIndex: number, persist: boolean = true) {
        setBoards(prev => {
            const copy = prev.map(b => ({ ...b, columns: b.columns ? b.columns.map(c => ({ ...c, tasks: c.tasks ? [...c.tasks] : [] })) : [] }))
            const board = copy.find(b => b.id === selectedBoardId)!
            const fromColumn = board.columns!.find(c => c.id === fromColumnId)!
            const toColumn = board.columns!.find(c => c.id === toColumnId)!
            const fromIndex = fromColumn.tasks!.findIndex(t => t.id === taskId)
            if (fromIndex === -1) return prev
            const [moved] = fromColumn.tasks!.splice(fromIndex, 1)

            // if moving within same column, adjust insertion index based on removal index
            if (fromColumnId === toColumnId) {
                const insertIndex = toIndex
                fromColumn.tasks!.splice(insertIndex, 0, moved)
            } else {
                toColumn.tasks!.splice(toIndex, 0, moved)
            }

            // persist only when requested
            if (persist) {
                try { saveData({ boards: copy, selectedBoardId }) } catch { }
            }

            const updatedSelected = copy.find(b => b.id === selectedBoardId);
            if (updatedSelected) setSelectedBoard(updatedSelected);
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
        const reset = ensureIds(data.boards)
        setBoards(reset)
        setSelectedBoard(reset[0])
    }

    function toggleSubtask(columnId: string, taskId: string, subtaskIndex: number) {
        setBoards(prevBoards => {
            const updatedBoards = prevBoards.map(board => {
                if (board.id !== selectedBoardId) return board;

                return {
                    ...board,
                    columns: (board.columns ?? []).map(col => {
                        if (col.id !== columnId) return col;

                        return {
                            ...col,
                            tasks: (col.tasks ?? []).map(task => {
                                if (task.id !== taskId) return task;

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
            try { saveData({ boards: updatedBoards, selectedBoardId }) } catch { }
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