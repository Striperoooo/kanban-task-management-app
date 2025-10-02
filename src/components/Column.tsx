import { useState } from "react";
import type { ColumnProps, Task } from "../types";
import TaskCard from './TaskCard';
import TaskDetailsModal from './TaskDetailsModal'

export default function Column({ column }: ColumnProps) {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)

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

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

        </div>
    )
}

