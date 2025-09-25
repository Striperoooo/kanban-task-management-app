// Core data types for the Kanban Task Management App

export interface Subtask {
    title: string;
    isCompleted: boolean;
}

export interface Task {
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
}

export interface Column {
    name: string;
    tasks: Task[];
}

export interface Board {
    name: string;
    columns: Column[];
}

export interface KanbanData {
    boards: Board[];
}

// UI State types
export interface AppState {
    boards: Board[];
    currentBoardIndex: number;
}