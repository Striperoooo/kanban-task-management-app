import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
    it('renders kanban app heading', () => {
        render(<App />)
        // App was refactored; assert for visible UI pieces instead
        const johnElements = screen.getAllByText('John Launch')
        expect(johnElements.length).toBeGreaterThanOrEqual(1)
        expect(screen.getByText(/ALL BOARDS/i)).toBeInTheDocument()
    })
})