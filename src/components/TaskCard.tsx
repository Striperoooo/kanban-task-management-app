import type { TaskProps } from "../types";
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, onClick }: TaskProps) {
    const completed = (task.subtasks ?? []).filter(st => st.isCompleted).length
    const total = (task.subtasks ?? []).length

    // use task.id as the draggable id; fall back to title for older data
    const draggableId = task.id ?? task.title
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: draggableId })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="taskcard-container relative bg-white rounded-lg px-4 py-6 mb-5 min-w-[280px] shadow-light-drop-shadow cursor-pointer hover:text-main-purple"
            onClick={onClick}
        >
            {/* Drag handle: listeners/attributes live here so clicking the card body doesn't start a drag */}
            <button
                type="button"
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                aria-label="Drag task"
                className="absolute top-2 right-2 p-1 text-medium-grey hover:text-main-purple cursor-grab"
            >
                {/* simple grip icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M10 6h2v2h-2zM14 6h2v2h-2zM6 6h2v2H6zM10 10h2v2h-2zM14 10h2v2h-2zM6 10h2v2H6zM10 14h2v2h-2zM14 14h2v2h-2zM6 14h2v2H6z" fill="currentColor" />
                </svg>
            </button>

            <h3 className="title font-bold text-[15px] mb-1">
                {task.title}
            </h3>
            <p className="subtasks-count font-bold text-medium-grey text-xs">
                {completed} of {total} subtasks
            </p>
        </div>
    )
}