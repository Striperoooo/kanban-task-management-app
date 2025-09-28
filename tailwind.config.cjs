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
                'medium-grey': '#828FA3'
            },
        },

    },
    plugins: [],
}
