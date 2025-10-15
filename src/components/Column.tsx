import { useState, useEffect } from "react";
import type { ColumnProps, Task } from "../types";
import TaskCard from './TaskCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskDetailsModal from './TaskDetailsModal'
import TaskFormModal from "./TaskFormModal";
import ConfirmModal from './ConfirmModal'
import { useDroppable } from '@dnd-kit/core'
import { useBoard } from "../contexts/BoardContext";

export default function Column({ column }: ColumnProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { deleteTask, selectedBoard } = useBoard()

    // keep selectedTask fresh when selectedBoard changes (e.g., after edits)
    useEffect(() => {
        if (!selectedTask) return;

        // find latest task by id across columns
        let latest: Task | null = null;
        for (const col of (selectedBoard.columns ?? [])) {
            const found = (col.tasks ?? []).find(t => t.id === selectedTask.id);
            if (found) {
                latest = { ...found, status: col.id ?? col.name };
                break;
            }
        }

        if (!latest) {
            setSelectedTask(null);
        } else {
            setSelectedTask(latest);
        }
    }, [selectedBoard]);

    const { setNodeRef } = useDroppable({ id: column.id ?? column.name })

    return (
        <div ref={setNodeRef} className="column-container  min-h-0 flex flex-col">
            <h2 className="column-name mb-6 font-bold text-medium-grey text-xs tracking-[2.4px]">
                <span className="column-color text-green-600 mr-1">
                    O
                </span>
                {column.name.toUpperCase()}
                <span className="ml-1 column-task-count">
                    ({(column.tasks ?? []).length})
                </span>
            </h2>

            <div className="tasks-list flex-1 min-h-0 pb-6">
                <SortableContext
                    items={(column.tasks ?? []).map(t => t.id ?? t.title)}
                    strategy={verticalListSortingStrategy}
                >
                    {(column.tasks ?? []).map(task => (
                        <TaskCard
                            key={task.id ?? task.title}
                            task={task}
                            onClick={() => setSelectedTask({ ...task, status: column.id ?? column.name })}
                        />
                    ))}
                </SortableContext>
            </div>

            {selectedTask && !editModalOpen && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onEdit={() => {
                        // ensure the taskToEdit has the correct original column id
                        setTaskToEdit({ ...selectedTask, status: column.id ?? column.name })
                        setEditModalOpen(true)
                        setSelectedTask(null)
                    }}
                    onDelete={() => {
                        // capture which task to delete and show confirm
                        setTaskToDelete(selectedTask)
                        setDeleteModalOpen(true)
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

            {deleteModalOpen && taskToDelete && (
                <ConfirmModal
                    title="Delete this task?"
                    message={`Are you sure you want to delete the '${taskToDelete.title}' task and its subtask? This action cannot be reversed.`}
                    danger
                    onConfirm={() => {
                        deleteTask(column.id ?? column.name, taskToDelete.id ?? taskToDelete.title)
                        setDeleteModalOpen(false)
                        setTaskToDelete(null)
                    }}
                    onCancel={() => {
                        setDeleteModalOpen(false)
                        setTaskToDelete(null)
                    }}
                />
            )}

        </div>
    )
}

