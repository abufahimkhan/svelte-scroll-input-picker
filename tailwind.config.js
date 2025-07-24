// tailwind.config.js
export default {
    theme: {
        extend: {
            fontFamily: {
                cinzel: ['Cinzel', 'serif']
            },
            animation: {
                fadeIn: 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                }
            }
        }
    }
}
