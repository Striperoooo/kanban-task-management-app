import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggle } = useTheme()
    const isDark = theme === 'dark'

    return (
        <button
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle theme"
            onClick={toggle}
            className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
        >
            <span
                className={`absolute left-1 top-1 h-6 w-6 rounded-full shadow transform transition-transform
                    ${isDark ? 'translate-x-6 bg-slate-200' : 'translate-x-0 bg-white'}`}
            />
        </button>
    )
}
