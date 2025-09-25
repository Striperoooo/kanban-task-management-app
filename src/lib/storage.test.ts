import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadData, saveData } from './storage'
import type { KanbanData } from '../types'

// Mock localStorage for testing
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
})

describe('Storage Utils', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        vi.clearAllMocks()
    })

    describe('loadData', () => {
        it('should load data from localStorage when available', () => {
            const mockData: KanbanData = {
                boards: [
                    {
                        name: 'Test Board',
                        columns: [
                            {
                                name: 'Test Column',
                                tasks: []
                            }
                        ]
                    }
                ]
            }

            localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData))

            const result = loadData()

            expect(localStorageMock.getItem).toHaveBeenCalledWith('kanban-data')
            expect(result).toEqual(mockData)
        })

        it('should return initial data when localStorage is empty', () => {
            localStorageMock.getItem.mockReturnValue(null)

            const result = loadData()

            expect(localStorageMock.getItem).toHaveBeenCalledWith('kanban-data')
            expect(result).toBeDefined()
            expect(result.boards).toBeDefined()
            expect(Array.isArray(result.boards)).toBe(true)
        })

        it('should handle localStorage errors gracefully', () => {
            localStorageMock.getItem.mockImplementation(() => {
                throw new Error('Storage unavailable')
            })

            const result = loadData()

            expect(result).toBeDefined()
            expect(result.boards).toBeDefined()
        })
    })

    describe('saveData', () => {
        it('should save data to localStorage', () => {
            const mockData: KanbanData = {
                boards: [
                    {
                        name: 'Test Board',
                        columns: []
                    }
                ]
            }

            saveData(mockData)

            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                'kanban-data',
                JSON.stringify(mockData)
            )
        })
    })
})