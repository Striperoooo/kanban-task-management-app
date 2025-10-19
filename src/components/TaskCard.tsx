import { useState } from 'react'
import type { TaskProps } from "../types";
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, onClick, preview }: TaskProps & { preview?: boolean }) {
    const completed = (task.subtasks ?? []).filter(st => st.isCompleted).length
    const total = (task.subtasks ?? []).length

    // use task.id as the draggable id; fall back to title for older data
    const draggableId = task.id ?? task.title
    // If this card is rendered inside a DragOverlay preview, skip sortable wiring
    // to avoid double-registration and nested drag handlers.
    let attributes: any = {}
    let listeners: any = {}
    let setNodeRef: any = undefined
    let transform: any = null
    let transition: any = undefined
    let isDragging = false
    if (!preview) {
        const sortable = useSortable({ id: draggableId })
        attributes = (sortable as any).attributes
        listeners = (sortable as any).listeners
        setNodeRef = (sortable as any).setNodeRef
        transform = (sortable as any).transform
        transition = (sortable as any).transition
        isDragging = (sortable as any).isDragging ?? false
    }

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition
    }

    // visual-only state for showing a rounded grip when dragging/touching
    const [gripActive, setGripActive] = useState(false)

    // merge sortable attributes/listeners and forward original handlers so we don't change DnD logic
    const mergedHandlers = {
        ...(attributes as any),
        ...(listeners as any),
        onPointerDown: (e: any) => {
            (attributes as any).onPointerDown?.(e)
                ; (listeners as any).onPointerDown?.(e)
            if (e.pointerType === 'touch') setGripActive(true)
        },
        onPointerUp: (e: any) => {
            (attributes as any).onPointerUp?.(e)
                ; (listeners as any).onPointerUp?.(e)
            setGripActive(false)
        },
        onPointerCancel: (e: any) => {
            (attributes as any).onPointerCancel?.(e)
                ; (listeners as any).onPointerCancel?.(e)
            setGripActive(false)
        },
        onPointerLeave: (e: any) => {
            (attributes as any).onPointerLeave?.(e)
                ; (listeners as any).onPointerLeave?.(e)
            setGripActive(false)
        },
        onTouchStart: (e: any) => {
            (attributes as any).onTouchStart?.(e)
                ; (listeners as any).onTouchStart?.(e)
            setGripActive(true)
        },
        onTouchEnd: (e: any) => {
            (attributes as any).onTouchEnd?.(e)
                ; (listeners as any).onTouchEnd?.(e)
            setGripActive(false)
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
        }
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className={`taskcard-container relative bg-white dark:bg-dark-header rounded-lg px-4 pr-12 md:pr-4 py-6 mb-5 w-[280px] shadow-light-drop-shadow cursor-pointer hover:text-main-purple transition-colors focus:outline-none focus:ring-2 focus:ring-main-purple ${isDragging ? 'opacity-0 pointer-events-none' : ''}`}
            onClick={onClick}
        >
            {/* Drag handle: listeners/attributes live here so clicking the card body doesn't start a drag */}
            <button
                type="button"
                {...mergedHandlers}
                onClick={(e) => e.stopPropagation()}
                aria-label="Drag task"
                className={`absolute top-2 right-2 p-3 md:p-1 text-medium-grey hover:text-main-purple hover:bg-slate-100 dark:hover:bg-dark-toggle rounded-full active:scale-95 cursor-grab ${gripActive ? 'ring-2 ring-main-purple/40 bg-main-purple/10' : ''}`}
            >
                {/* simple grip icon - larger on mobile for easier touch, desktop keeps original size */}
                <svg className="w-6 h-6 md:w-[14px] md:h-[14px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10 6h2v2h-2zM14 6h2v2h-2zM6 6h2v2H6zM10 10h2v2h-2zM14 10h2v2h-2zM6 10h2v2H6zM10 14h2v2h-2zM14 14h2v2h-2zM6 14h2v2H6z" fill="currentColor" />
                </svg>
            </button>

            <h3 className="title font-bold text-[15px] mb-1">
                {task.title}
            </h3>
            <p className="subtasks-count font-bold text-medium-grey text-xs">
                {completed} of {total} subtasks
            </p>
        </div>
    )
}