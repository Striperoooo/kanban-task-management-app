import { useState } from "react";
import { useBoard } from "../contexts/BoardContext";
import iconCross from '../assets/icon-cross.svg'
import type { Task } from "../types"

export default function TaskFormModal({
    onClose,
    mode = "add",
    initialTask,
}: {
    onClose: () => void,
    mode?: "add" | "edit",
    initialTask?: Task,
}) {


    const { selectedBoard, addTask, editTask } = useBoard();

    // statusOptions are column ids (value) with label = column.name
    const statusOptions = (selectedBoard.columns ?? []).map(col => ({ id: col.id ?? col.name, name: col.name }))
    const [title, setTitle] = useState(initialTask?.title || "");
    const [desc, setDesc] = useState(initialTask?.description || "");
    const [subtasks, setSubtasks] = useState(
        initialTask?.subtasks?.map(st => st.title) || [""]
    );
    const [status, setStatus] = useState(initialTask?.status || statusOptions[0]?.id || "");
    const [error, setError] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) {
            setError("Task title is required.");
            return;
        }

        const newTask = {
            id: initialTask?.id ?? `task-${Date.now()}`,
            title: title.trim(),
            description: desc.trim(),
            status,
            subtasks: subtasks.filter(st => st.trim() !== "").map(st => ({
                title: st.trim(),
                isCompleted: false
            }))

        }

        if (mode === "edit") {
            // original column id is where the task currently lives (initialTask.status)
            editTask(initialTask?.status ?? status, newTask, initialTask?.id ?? "")
        } else {
            addTask(status, newTask)
        }
        onClose()

    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-md p-6 min-w-[320px] max-w-[90vw] max-h-[calc(100vh-2rem)] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <h2 className="font-bold text-lg mb-6">
                    {mode === "edit" ? "Edit Task" : "Add New Task"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <label className="block font-bold text-xs text-medium-grey mb-2">Title</label>
                    <input
                        className="font-medium text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full"
                        placeholder="e.g. Take coffee break"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    {error === "Task title is required." && (
                        <p className="text-red-500 text-xs mt-1 mb-2">{error}</p>
                    )}

                    <label className="block font-bold text-xs text-medium-grey mt-6 mb-2">Description</label>
                    <textarea
                        className="font-medium text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full"
                        placeholder="e.g. It's always good to take a break."
                        value={desc}
                        onChange={e => setDesc(e.target.value)}
                        rows={3}
                    />

                    <label className="block font-bold text-xs text-medium-grey mt-6 mb-2">Subtasks</label>
                    {subtasks.map((sub, idx) => (
                        <div key={idx} className="flex items-center gap-3 mb-3">
                            <input
                                className="font-medium text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full active:border-main-purple"
                                placeholder="e.g. Make coffee"
                                value={sub}
                                onChange={e => {
                                    const newSubs = [...subtasks];
                                    newSubs[idx] = e.target.value;
                                    setSubtasks(newSubs);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setSubtasks(subtasks.filter((_, i) => i !== idx))}
                                aria-label="Remove subtask"
                            >
                                <img src={iconCross} alt="icon cross" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="w-full bg-[#635FC7]/10 font-bold text-center text-main-purple text-[13px] leading-[23px] rounded-[20px] hover:bg-[#635FC7]/25 py-2 mb-6"
                        onClick={() => setSubtasks([...subtasks, ""])}
                    >
                        + Add New Subtask
                    </button>

                    <label className="block font-bold text-xs text-medium-grey mt-6 mb-2">Status</label>
                    <select
                        className="font-medium bg-white text-[13px] leading-[23px] py-2 px-4 border border-[#828FA3] border-opacity-25 rounded-sm p-2 w-full"
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                    >
                        <option value="" disabled>Select status</option>
                        {statusOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>

                    <div className="flex gap-2 justify-end mt-6">
                        <button
                            type="submit"
                            className="w-full bg-main-purple font-bold text-center text-white text-[13px] leading-[23px] rounded-[20px] hover:bg-main-purple-hover py-2 mb-6"
                        >
                            {mode === "edit" ? "Save Changes" : "Create New Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}