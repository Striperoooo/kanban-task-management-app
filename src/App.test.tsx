import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
    it('renders kanban app heading', () => {
        render(<App />)
        expect(screen.getByText('Kanban Task Management App')).toBeInTheDocument()
        expect(screen.getByText('Clean slate ready for development')).toBeInTheDocument()
    })
})