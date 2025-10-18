import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { useBoard } from '../contexts/BoardContext';
import Column from './Column';
import ErrorBoundary from './ErrorBoundary'

// Minimal DnD scaffold: handle drag end and call moveTask to reorder within a column
export default function BoardView() {
    const { selectedBoard, moveTask } = useBoard()

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

        // Avoid redundant moves: if the active task is already at the target position, do nothing.
        // This prevents repeated state updates during dragOver which can cause measurement loops
        // in @dnd-kit and lead to "Maximum update depth exceeded".
    const fromCol = (selectedBoard.columns ?? []).find(c => c.id === fromColumnId || c.name === fromColumnId)
        const fromIndex = fromCol ? (fromCol.tasks ?? []).findIndex(t => (t.id ?? t.title) === activeId) : -1

        // If moving within same column and index didn't change, skip the move
        if (fromColumnId === toColumnId && fromIndex === toIndex) return

        // Otherwise perform optimistic local move (no persist)
        moveTask(fromColumnId, toColumnId, activeId, toIndex, false)
    }

    return (
        <ErrorBoundary>
            <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
                <div className='board-container flex-1 min-h-0 flex overflow-x-auto gap-6 ml-1 px-6 py-0 box-border items-stretch'>
                    <div className='board-inner w-full flex gap-6 py-6 px-4'>
                        {(selectedBoard.columns ?? []).map((column) => (
                            <Column key={column.id ?? column.name} column={column} />
                        ))}
                    </div>
                </div>
            </DndContext>
        </ErrorBoundary>
    )
}
