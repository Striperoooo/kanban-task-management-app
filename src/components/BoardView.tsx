import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
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

        // ids are task titles in this minimal scaffold; we need to find their column
        let fromColumn: string | null = null
        let toColumn: string | null = null
        let toIndex = -1

        for (const col of (selectedBoard.columns ?? [])) {
            const idxA = (col.tasks ?? []).findIndex(t => t.title === activeId)
            const idxB = (col.tasks ?? []).findIndex(t => t.title === overId)
            if (idxA > -1) {
                fromColumn = col.name
            }
            if (idxB > -1) {
                toColumn = col.name
                toIndex = idxB
            }
        }

        if (!fromColumn || !toColumn) return

        // Only support reorder within same column for now
        if (fromColumn === toColumn) {
            moveTask(fromColumn, activeId, toIndex)
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className='board-container h-full flex overflow-x-auto gap-6  px-6 py-6'>
                {(selectedBoard.columns ?? []).map((column) => (
                    <Column key={column.name} column={column} />
                ))}
            </div>
        </DndContext>
    )
}
