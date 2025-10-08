import { useState } from "react";
import type { ColumnProps, Task } from "../types";
import TaskCard from './TaskCard';
import TaskDetailsModal from './TaskDetailsModal'
import TaskFormModal from "./TaskFormModal";
import { useBoard } from "../contexts/BoardContext";

export default function Column({ column }: ColumnProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false)

    const { editTask } = useBoard()

    return (
        <div className="column-container h-full flex flex-col">
            <h2 className="column-name mb-6 font-bold text-medium-grey text-xs tracking-[2.4px]">
                <span className="column-color text-green-600 mr-1">
                    O
                </span>
                {column.name.toUpperCase()}
                <span className="ml-1 column-task-count">
                    ({column.tasks.length})
                </span>
            </h2>

            {column.tasks.map(task => (
                <TaskCard
                    key={task.title}
                    task={task}
                    onClick={() => setSelectedTask(task)}
                />
            ))}

            {selectedTask && !editModalOpen && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onEdit={() => {
                        // ensure the taskToEdit has the correct original column name
                        setTaskToEdit({ ...selectedTask, status: column.name })
                        setEditModalOpen(true)
                        setSelectedTask(null)
                    }}
                />
            )}

            {editModalOpen && taskToEdit && (
                <TaskFormModal
                    mode="edit"
                    initialTask={taskToEdit}
                    onClose={() => {
                        setEditModalOpen(false)
                        setTaskToEdit(null)
                    }}
                />
            )}

        </div>
    )
}

