import { useState } from "react";
import type { Task } from "../types";
import EllipsisMenu from "./EllipsisMenu";
import { useBoard } from "../contexts/BoardContext";

export default function TaskDetailsModal({
    task,
    onClose,
    onEdit,
    onDelete
}: {
    task: Task,
    onClose: () => void,
    onEdit: () => void,
    onDelete: () => void

}) {
    const { selectedBoard, toggleSubtask, editTask } = useBoard();

    const completed = (task.subtasks ?? []).filter(st => st.isCompleted).length;
    const total = (task.subtasks ?? []).length;

    // statusOptions are column ids with labels
    const statusOptions = (selectedBoard.columns ?? []).map(col => ({ id: col.id ?? col.name, name: col.name }))
    const [status, setStatus] = useState<string>(task.status ?? (statusOptions[0]?.id ?? ""));

    function handleToggleSubtask(index: number) {
        toggleSubtask(task.status, task.id ?? task.title, index);
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newStatus = e.target.value;
        setStatus(newStatus);

        const updatedTask: Task = { ...task, status: newStatus };
        editTask(task.status, updatedTask, task.id ?? task.title);
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-dark-surface rounded-lg p-6 min-w-[320px] max-w-[90vw] relative transition-colors"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-lg max-w-[80%]">{task.title}</h2>
                    <EllipsisMenu
                        items={[
                            { label: "Edit Task", onClick: onEdit },
                            { label: "Delete Task", onClick: onDelete, danger: true }
                        ]}
                    />
                </div>

                <p className="font-medium text-[13px] text-medium-grey leading-[23px] mb-4">{task.description}</p>

                <span className="inline-block font-bold text-xs text-medium-grey mb-4">
                    Subtasks ({completed} of {total})
                </span>

                <ul className="mb-4">
                    {(task.subtasks ?? []).map((sub, i) => {
                        // prefer a stable id here (task.id + i)
                        const inputId = `subtask-${(task.id ?? (task.title || 'task')).replace(/\s+/g, '-').toLowerCase()}-${i}`;

                        return (
                            <li key={inputId} className="mb-2">
                                <label
                                    htmlFor={inputId}
                                    className="flex items-center gap-4 font-bold text-xs bg-light-bg dark:bg-dark-subtask p-3 cursor-pointer hover:bg-main-purple/25 rounded-sm transition-colors"
                                >
                                    <input
                                        id={inputId}
                                        type="checkbox"
                                        checked={sub.isCompleted}
                                        onChange={() => handleToggleSubtask(i)}
                                        className="shrink-0 cursor-pointer"
                                    />
                                    <span className={sub.isCompleted ? "line-through text-medium-grey" : ""}>
                                        {sub.title}
                                    </span>
                                </label>
                            </li>
                        )
                    })}
                </ul>

                <label className="inline-block font-bold text-xs text-medium-grey mb-2">Current Status</label>
                <select
                    className="font-medium bg-white dark:bg-dark-header text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full transition-colors cursor-pointer"
                    value={status}
                    onChange={handleStatusChange}
                >
                    <option value="" disabled>Select status</option>
                    {statusOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            </div>
        </div>
    )

}