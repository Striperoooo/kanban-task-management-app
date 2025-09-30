/** @type {import('tailwindcss').Config} */
module.exports = {
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
        },

    },
    plugins: [],
}
