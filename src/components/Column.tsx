import type { ColumnProps } from "../types";
import TaskCard from './TaskCard';

export default function Column({ column }: ColumnProps) {
    return (
        <div className="column-container h-full">
            <h2 className="font-bold text-xs text-medium-grey tracking-[2.4px]">
                <span className="column-color text-green-600 mr-1">
                    O
                </span>
                {column.name.toUpperCase()}
                <span className="ml-1 column-task-count">
                    ({column.tasks.length})
                </span>
            </h2>

        </div>
    )
}

