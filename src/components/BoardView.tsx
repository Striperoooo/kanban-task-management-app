import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { useBoard } from '../contexts/BoardContext';
import Column from './Column';

// Minimal DnD scaffold: handle drag end and call moveTask to reorder within a column
export default function BoardView() {
    const { selectedBoard, moveTask } = useBoard()

    function handleDragEnd(e: DragEndEvent) {
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

        // optimistic local move (no persist) so UI keeps up with drag
        moveTask(fromColumnId, toColumnId, activeId, toIndex, false)
    }

    return (
        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
            <div className='board-container flex-1 min-h-0 flex overflow-x-auto gap-6 ml-1 px-6 py-0 box-border items-stretch'>
                <div className='board-inner w-full flex gap-6 py-6 px-4'>
                    {(selectedBoard.columns ?? []).map((column) => (
                        <Column key={column.id ?? column.name} column={column} />
                    ))}
                </div>
            </div>
        </DndContext>
    )
}
