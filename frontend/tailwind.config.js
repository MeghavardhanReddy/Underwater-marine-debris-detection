/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sonar: {
          cyan: '#00f2fe',
          teal: '#00e5bc',
          blue: '#0284c7',
          gold: '#eab308',
          amber: '#f59e0b',
          dark: '#020b14',
          navy: '#051322',
          card: 'rgba(5, 23, 41, 0.75)',
          panel: 'rgba(3, 16, 30, 0.85)',
          border: 'rgba(0, 242, 254, 0.18)',
          'border-bright': 'rgba(0, 242, 254, 0.55)',
          highlight: 'rgba(0, 242, 254, 0.12)',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 242, 254, 0.35)',
        'glow-cyan-lg': '0 0 35px -5px rgba(0, 242, 254, 0.5)',
        'glow-teal': '0 0 20px -3px rgba(0, 229, 188, 0.35)',
        'glow-gold': '0 0 20px -3px rgba(234, 179, 8, 0.35)',
      },
      animation: {
        'radar-sweep': 'radarSweep 4s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'caustic': 'causticMove 12s ease-in-out infinite',
        'ping-slow': 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.9, transform: 'scale(1)' },
          '50%': { opacity: 0.65, transform: 'scale(0.995)' },
        },
        causticMove: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(2%, 3%) scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
