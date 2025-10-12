import type { TaskProps } from "../types";
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, onClick }: TaskProps) {
    const completed = task.subtasks.filter(st => st.isCompleted).length
    const total = task.subtasks.length

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
            {...attributes}
            {...listeners}
            className="taskcard-container bg-white rounded-lg px-4 py-6 mb-5 min-w-[280px] shadow-light-drop-shadow cursor-pointer hover:text-main-purple"
            onClick={onClick}
        >
            <h3 className="title font-bold text-[15px] mb-1">
                {task.title}
            </h3>
            <p className="subtasks-count font-bold text-medium-grey text-xs">
                {completed} of {total} subtasks
            </p>
        </div>
    )
}