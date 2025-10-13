import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'kanban.theme'

const ThemeContext = createContext({
    theme: 'light' as Theme,
    toggle: () => { }
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const getInitial = (): Theme => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
            if (saved === 'dark' || saved === 'light') return saved
        } catch { }

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
        return 'light'
    }

    const [theme, setTheme] = useState<Theme>(getInitial)

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') root.classList.add('dark')
        else root.classList.remove('dark')
        try { localStorage.setItem(STORAGE_KEY, theme) } catch { }
    }, [theme])

    const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContext
