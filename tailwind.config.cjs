/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            },
            colors: {
                'light-bg': '#F4F7FD',
                'main-purple': '#635FC7',
                'main-purple-hover': '#A8A4FF',
                'main-purple-second-hover': "#635FC71A",
                'medium-grey': '#828FA3'
            },
            boxShadow: {
                'light-drop-shadow': '0px 4px 6px 0px rgba(54, 78, 126, 0.1015)',
            }
        },

    },
    plugins: [],
}
