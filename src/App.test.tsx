import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
    it('renders Vite + React + Tailwind heading', () => {
        render(<App />)
        expect(screen.getByText('Vite + React + Tailwind')).toBeInTheDocument()
    })
})