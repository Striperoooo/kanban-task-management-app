// Core data types for the Kanban Task Management App

export interface Subtask {
    title: string
    isCompleted: boolean
}

export interface Task {
    title: string
    description: string
    status: string
    subtasks?: Subtask[]
}

export interface TaskProps {
    task: Task
    onClick?: () => void
}

export interface Column {
    name: string
    tasks?: Task[]
}

export interface ColumnProps {
    column: Column
}

export interface Board {
    name: string
    columns?: Column[]
}

export interface BoardProps {
    boards: Board[]
}

export interface KanbanData {
    boards: Board[]
}

export interface ConfirmModalProps {
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    danger?: boolean
}

// UI State types
export interface AppState {
    boards: Board[]
    currentBoardIndex: number
}