import { useEffect } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'

// Mock storage module before importing BoardProvider so it uses mocked loadData
const mockSave = vi.fn()
const mockLoad = vi.fn()
const mockClear = vi.fn()

vi.mock('../lib/storage', () => ({
    loadData: () => mockLoad(),
    saveData: (d: any) => mockSave(d),
    clearData: () => mockClear(),
}))

import { BoardProvider, useBoard } from './BoardContext'

// Helper component to grab context reference
function Grabber({ onReady }: { onReady: (ctx: any) => void }) {
    const ctx = useBoard()
    useEffect(() => {
        onReady(ctx)
    }, [ctx])
    return null
}

describe('BoardContext (core mutators)', () => {
    let ctxRef: any = null

    beforeEach(() => {
        vi.clearAllMocks()
        // default mocked data: one board with two columns and one task
        mockLoad.mockReturnValue({
            boards: [
                {
                    id: 'b1',
                    name: 'Board One',
                    columns: [
                        { id: 'c1', name: 'Todo', tasks: [{ id: 't1', title: 'Task 1', subtasks: [{ title: 's1', isCompleted: false }] }] },
                        { id: 'c2', name: 'Done', tasks: [] }
                    ]
                }
            ],
            selectedBoardId: 'b1'
        })
        ctxRef = null
        render(
            <BoardProvider>
                <Grabber onReady={(ctx) => { ctxRef = ctx }} />
            </BoardProvider>
        )
    })

    it('initializes with loaded data', () => {
        expect(ctxRef).toBeTruthy()
        expect(ctxRef.boards.length).toBe(1)
        expect(ctxRef.selectedBoard.id).toBe('b1')
    })

    it('addBoard appends and selects new board', () => {
        act(() => {
            ctxRef.addBoard({ name: 'New Board', columns: [{ name: 'Col', tasks: [] }] } as any)
        })
        expect(ctxRef.boards.length).toBe(2)
        // saveData should have been called (persist)
        expect(mockSave).toHaveBeenCalled()
        // selectedBoard should now be the newly added board
        expect(ctxRef.selectedBoard.name).toBe('New Board')
    })

    it('addTask adds a task to the column', () => {
        act(() => {
            ctxRef.addTask('c1', { id: 't2', title: 'Task 2', subtasks: [] })
        })
        const col = ctxRef.boards[0].columns.find((c: any) => c.id === 'c1')
        expect(col.tasks.some((t: any) => t.id === 't2')).toBe(true)
    })

    it('editTask updates an existing task in place', () => {
        act(() => {
            ctxRef.editTask('c1', { id: 't1', title: 'Task 1 updated', status: 'c1', subtasks: [] }, 't1')
        })
        const task = ctxRef.boards[0].columns.find((c: any) => c.id === 'c1').tasks.find((t: any) => t.id === 't1')
        expect(task.title).toBe('Task 1 updated')
    })

    it('deleteTask removes a task from a column', () => {
        act(() => {
            ctxRef.deleteTask('c1', 't1')
        })
        const col = ctxRef.boards[0].columns.find((c: any) => c.id === 'c1')
        expect(col.tasks.find((t: any) => t.id === 't1')).toBeUndefined()
    })

    it('moveTask reorders within same column', () => {
        // add two tasks then move t2 before t1
        act(() => {
            ctxRef.addTask('c1', { id: 't2', title: 'Task 2', subtasks: [] })
            ctxRef.moveTask('c1', 'c1', 't2', 0, false)
        })
        const tasks = ctxRef.boards[0].columns.find((c: any) => c.id === 'c1').tasks
        expect(tasks[0].id).toBe('t2')
    })

    it('moveTask across columns moves task to target column', () => {
        // move t1 from c1 to c2
        act(() => {
            ctxRef.moveTask('c1', 'c2', 't1', 0, false)
        })
        const from = ctxRef.boards[0].columns.find((c: any) => c.id === 'c1')
        const to = ctxRef.boards[0].columns.find((c: any) => c.id === 'c2')
        expect(from.tasks.find((t: any) => t.id === 't1')).toBeUndefined()
        expect(to.tasks.find((t: any) => t.id === 't1')).toBeTruthy()
    })

    it('toggleSubtask flips a subtask isCompleted flag', () => {
        act(() => {
            ctxRef.toggleSubtask('c1', 't1', 0)
        })
        const task = ctxRef.boards[0].columns.find((c: any) => c.id === 'c1').tasks.find((t: any) => t.id === 't1')
        expect(task.subtasks[0].isCompleted).toBe(true)
    })

    it('persists boards on state changes via saveData', () => {
        act(() => {
            ctxRef.addTask('c1', { id: 't9', title: 'Persist Task', subtasks: [] })
        })
        expect(mockSave).toHaveBeenCalled()
    })
})
