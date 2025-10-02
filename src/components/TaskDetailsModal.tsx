import type { Task } from "../types";

export default function TaskDetailsModal({ task, onClose }: { task: Task, onClose: () => void }) {
    const completed = task.subtasks.filter(st => st.isCompleted).length
    const total = task.subtasks.length

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-6 min-w-[320px] max-w-[90vw] relative"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="font-bold text-lg mb-2">{task.title}</h2>
                <p className="font-medium text-[13px] text-medium-grey leading-[23px] mb-4">{task.description}</p>

                <span className="inline-block font-bold text-xs text-medium-grey mb-4">
                    Subtasks ({completed} of {total})
                </span>

                <ul>
                    {task.subtasks.map((sub, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-4 font-bold text-xs bg-light-bg p-3 mb-2 "
                        >
                            <input type="checkbox" checked={sub.isCompleted} readOnly className="" />
                            {sub.title}
                        </li>
                    ))}
                </ul>

                <span className="inline-block font-bold text-xs text-medium-grey mb-2">Current Status</span>
                <p>THIS A DROPDOWN BLUD</p>
            </div>
        </div>
    )

}