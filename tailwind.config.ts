/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			twinkle: {
  				'0%, 100%': { opacity: 0.2 },
  				'50%': { opacity: 0.8 },
  			},
  			'float-slow': {
  				'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
  				'50%': { transform: 'translateY(-20px) rotate(5deg)' },
  			},
  			'float-medium': {
  				'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
  				'50%': { transform: 'translateY(-15px) rotate(-5deg)' },
  			},
  			'float-fast': {
  				'0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
  				'50%': { transform: 'translateY(-10px) rotate(3deg)' },
  			},
  			'beam-slow': {
  				'0%, 100%': { opacity: 0.1, transform: 'translateX(0)' },
  				'50%': { opacity: 0.3, transform: 'translateX(10px)' },
  			},
  			'beam-medium': {
  				'0%, 100%': { opacity: 0.1, transform: 'translateX(0)' },
  				'50%': { opacity: 0.3, transform: 'translateX(-10px)' },
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'twinkle': 'twinkle 5s ease-in-out infinite',
  			'float-slow': 'float-slow 8s ease-in-out infinite',
  			'float-medium': 'float-medium 6s ease-in-out infinite',
  			'float-fast': 'float-fast 4s ease-in-out infinite',
  			'beam-slow': 'beam-slow 10s ease-in-out infinite',
  			'beam-medium': 'beam-medium 8s ease-in-out infinite',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}