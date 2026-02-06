/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
    darkMode: ['selector', '[class="app-dark"]'],
    content: ['./src/**/*.{html,ts,scss,css}', './index.html'],
    plugins: [PrimeUI],
    theme: {
        screens: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1920px',
            '2xlCustom': '1624px'
        },
        extend: {
            keyframes: {
                fadeInLeft: {
                    from: {
                        opacity: '0',
                        transform: 'translateX(-50px)'
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateX(0)'
                    }
                }
            },
            animation: {
                'fade-left': 'fadeInLeft 0.8s ease-out forwards'
            },
            boxShadow: {
                ios: '0 4px 24px -1px rgba(0, 0, 0, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.06)'
            }
        }
    }
};
