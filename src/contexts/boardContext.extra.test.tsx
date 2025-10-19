import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act, screen } from '@testing-library/react'

// Mock storage module before importing providers
const mockSave = vi.fn()
const mockLoad = vi.fn()
const mockClear = vi.fn()

vi.mock('../lib/storage', () => ({
    loadData: () => mockLoad(),
    saveData: (d: any) => mockSave(d),
    clearData: () => mockClear(),
}))

import { BoardProvider, useBoard } from './BoardContext'
import BoardView from '../components/BoardView'

function Grabber({ onReady }: { onReady: (ctx: any) => void }) {
    const ctx = useBoard()
    React.useEffect(() => onReady(ctx), [ctx])
    return null
}

describe('Extra BoardContext tests', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deleteBoard removes board and selects a fallback and persists', () => {
        // Setup two boards in load
        mockLoad.mockReturnValue({
            boards: [
                { id: 'b1', name: 'Board One', columns: [] },
                { id: 'b2', name: 'Board Two', columns: [] },
            ],
            selectedBoardId: 'b2'
        })

        let ctxRef: any = null
        render(
            <BoardProvider>
                <Grabber onReady={(c) => { ctxRef = c }} />
            </BoardProvider>
        )

        // ensure initial state
        expect(ctxRef.boards.length).toBe(2)
        expect(ctxRef.selectedBoard.id).toBe('b2')

        act(() => {
            // deleteBoard expects the board name (legacy API) so pass the name
            ctxRef.deleteBoard('Board Two')
        })

        expect(ctxRef.boards.find((b: any) => b.id === 'b2')).toBeUndefined()
        // selected should not be deleted board; it should pick something alive (b1)
        expect(ctxRef.selectedBoard.id).not.toBe('b2')
        expect(ctxRef.boards.length).toBe(1)
        expect(mockSave).toHaveBeenCalled()
    })

    it('respects selectedBoardId from persisted load on init', () => {
        mockLoad.mockReturnValue({
            boards: [
                { id: 'bA', name: 'A', columns: [] },
                { id: 'bB', name: 'B', columns: [] }
            ],
            selectedBoardId: 'bB'
        })

        let ctxRef: any = null
        render(
            <BoardProvider>
                <Grabber onReady={(c) => { ctxRef = c }} />
            </BoardProvider>
        )

        expect(ctxRef.selectedBoard.id).toBe('bB')
    })

    it('BoardView renders tasks from provider (smoke)', () => {
        // Provide a board with a column and a task and assert BoardView shows it
        mockLoad.mockReturnValue({
            boards: [
                {
                    id: 'bv1',
                    name: 'BV Board',
                    columns: [
                        { id: 'col1', name: 'Todo', tasks: [{ id: 'task-x', title: 'Task X', subtasks: [] }] }
                    ]
                }
            ],
            selectedBoardId: 'bv1'
        })

        render(
            <BoardProvider>
                <BoardView />
            </BoardProvider>
        )

        // task title should appear in the rendered view
        expect(screen.getByText('Task X')).toBeInTheDocument()
    })

})
