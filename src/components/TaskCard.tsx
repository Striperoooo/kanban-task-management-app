import type { TaskProps } from "../types";

export default function TaskCard({ task }: TaskProps) {
    const completed = task.subtasks.filter(st => st.isCompleted).length
    const total = task.subtasks.length

    return (
        <div className="taskcard-container bg-white rounded-lg px-4 py-6 mb-5 min-w-[280px] shadow-light-drop-shadow">
            <h3 className="title font-bold text-[15px] mb-1">
                {task.title}
            </h3>
            <p className="subtasks-count font-bold text-medium-grey text-xs">
                {completed} of {total} subtasks
            </p>
        </div>
    )
}