import { DndContext, DragOverlay } from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { useBoard } from '../contexts/BoardContext';
import Column from './Column';
import TaskCard from './TaskCard'
import ErrorBoundary from './ErrorBoundary'
import EditBoardModal from './EditBoardModal'
import { useRef, useEffect, useState } from 'react'

// Minimal DnD scaffold: handle drag end and call moveTask to reorder within a column
export default function BoardView() {
    const { selectedBoard, moveTask } = useBoard()

    // refs for debouncing and preventing immediate reverse moves
    const dragOverTimeout = useRef<number | null>(null)
    const lastOptimistic = useRef<{ from: string, to: string, index: number, time: number } | null>(null)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)

    function handleDragEnd(e: DragEndEvent) {
        try {
            const { active, over } = e
            if (!over) return

            const activeId = String(active.id)
            const overId = String(over.id)

            if (activeId === overId) return

            // find source and target columns by task id
            let fromColumnId: string | null = null
            let toColumnId: string | null = null
            let toIndex = -1

            for (const col of (selectedBoard.columns ?? [])) {
                const idxA = (col.tasks ?? []).findIndex(t => (t.id ?? t.title) === activeId)
                const idxB = (col.tasks ?? []).findIndex(t => (t.id ?? t.title) === overId)
                if (idxA > -1) fromColumnId = col.id ?? col.name
                if (idxB > -1) {
                    toColumnId = col.id ?? col.name
                    toIndex = idxB
                }
            }

            if (!fromColumnId || !toColumnId) return



            // clear any recorded optimistic intent so reverse-guard won't block the final persist
            lastOptimistic.current = null
            setActiveId(null)

            // final move (persist)
            moveTask(fromColumnId, toColumnId, activeId, toIndex, true)
        } catch (err) {
            console.error('[BoardView] handleDragEnd error', err, { active: e.active?.id, over: e.over?.id })
            throw err
        }
    }

    function handleDragOver(e: DragOverEvent) {
        const { active, over } = e
        if (!over) return
        const activeId = String(active.id)
        const overId = String(over.id)

        // find source and target by task id or column droppable id
        let fromColumnId: string | null = null
        let toColumnId: string | null = null
        let toIndex = -1

        for (const col of (selectedBoard.columns ?? [])) {
            const idxA = (col.tasks ?? []).findIndex(t => (t.id ?? t.title) === activeId)
            const idxB = (col.tasks ?? []).findIndex(t => (t.id ?? t.title) === overId)
            if (idxA > -1) fromColumnId = col.id ?? col.name
            if (idxB > -1) {
                toColumnId = col.id ?? col.name
                toIndex = idxB
            }
            // if `over` is the column droppable element (id === col.id), place at end
            if (overId === (col.id ?? col.name)) {
                toColumnId = col.id ?? col.name
                toIndex = (col.tasks ?? []).length
            }
        }

        if (!fromColumnId || !toColumnId) return

        // track active id for DragOverlay preview
        setActiveId(activeId)

        // Avoid redundant moves: if the active task is already at the target position, do nothing.
        // This prevents repeated state updates during dragOver which can cause measurement loops
        // in @dnd-kit and lead to "Maximum update depth exceeded".
        const fromCol = (selectedBoard.columns ?? []).find(c => c.id === fromColumnId || c.name === fromColumnId)
        const fromIndex = fromCol ? (fromCol.tasks ?? []).findIndex(t => (t.id ?? t.title) === activeId) : -1

        // If moving within same column and index didn't change, skip the move
        if (fromColumnId === toColumnId && fromIndex === toIndex) return

        // Avoid rapid flip-flop between two columns: if the last optimistic move
        // was the inverse of this one and happened recently, skip it.
        const now = Date.now()
        const last = lastOptimistic.current
        if (last && last.from === toColumnId && last.to === fromColumnId && (now - last.time) < 250) {
            return
        }

        // Debounce optimistic moves to avoid flooding state updates during fast pointer movements.
        // Use a lower delay for cross-column moves so UX stays responsive, and record the
        // intended optimistic move immediately so the reverse-guard won't flip it back.
        try { if (dragOverTimeout.current) window.clearTimeout(dragOverTimeout.current) } catch { }
        const isCrossColumn = fromColumnId !== toColumnId
        const delay = isCrossColumn ? 40 : 120

        // record intent immediately to avoid immediate reverse flip-flop
        lastOptimistic.current = { from: fromColumnId, to: toColumnId, index: toIndex, time: Date.now() }

        dragOverTimeout.current = window.setTimeout(() => {
            moveTask(fromColumnId, toColumnId, activeId, toIndex, false)
            // update time to actual apply time
            lastOptimistic.current = { from: fromColumnId, to: toColumnId, index: toIndex, time: Date.now() }
            dragOverTimeout.current = null
        }, delay) as unknown as number

    }

    // cleanup pending timeout on unmount
    useEffect(() => {
        return () => {
            try { if (dragOverTimeout.current) window.clearTimeout(dragOverTimeout.current) } catch { }
        }
    }, [])

    return (
        <ErrorBoundary>
            <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
                <div className='board-container flex-1 min-h-0 flex overflow-x-auto gap-6 ml-1 px-6 py-0 box-border items-stretch'>
                    <div className='board-inner w-full flex gap-6 py-6 px-4'>
                        {(selectedBoard.columns ?? []).map((column) => (
                            <Column key={column.id ?? column.name} column={column} />
                        ))}

                        <div className='w-[280px] h-screen mt-10 bg-[#E9EFFA] flex-shrink-0 flex items-center justify-center rounded-lg border-2 border-dashed border-transparent dark:border-transparent dark:bg-dark-linear/50'>
                            <button
                                className='px-4 py-3 rounded-md text-medium-grey bg-white/0 hover:text-main-purple hover:bg-main-purple-second-hover 
                                dark:hover:bg-dark-header transition-colors  font-bold'
                                onClick={() => setEditModalOpen(true)}
                            >
                                + New Column
                            </button>
                        </div>
                    </div>
                </div>

                {editModalOpen && (
                    <EditBoardModal
                        board={selectedBoard}
                        onClose={() => setEditModalOpen(false)}
                        autoAddEmptyColumn
                        autoFocusIndex={(selectedBoard.columns ?? []).length}
                    />
                )}

                <DragOverlay dropAnimation={{ duration: 120 }}>
                    {activeId ? (() => {
                        // find the active task across columns
                        for (const col of (selectedBoard.columns ?? [])) {
                            const t = (col.tasks ?? []).find(x => (x.id ?? x.title) === activeId)
                            if (t) return <TaskCard task={t} />
                        }
                        return null
                    })() : null}
                </DragOverlay>
            </DndContext>
        </ErrorBoundary>
    )
}
