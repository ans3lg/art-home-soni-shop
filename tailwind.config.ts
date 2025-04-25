import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: ['Playfair Display', 'serif'],
			},
			colors: {
				border: 'hsl(30, 20%, 85%)', // Soft warm gray border
				input: 'hsl(30, 20%, 90%)', // Lighter input background
				ring: 'hsl(30, 70%, 50%)', // Warm orange accent
				background: 'hsl(30, 30%, 98%)', // Very light warm background
				foreground: 'hsl(20, 14%, 20%)', // Dark brown text for contrast
				primary: {
					DEFAULT: 'hsl(30, 70%, 45%)', // Warm amber
					foreground: 'hsl(0, 0%, 100%)' // White text on primary
				},
				secondary: {
					DEFAULT: 'hsl(30, 20%, 95%)', // Very light warm gray
					foreground: 'hsl(20, 14%, 30%)' // Slightly lighter text
				},
				muted: {
					DEFAULT: 'hsl(30, 20%, 90%)', // Light warm gray
					foreground: 'hsl(20, 14%, 45%)' // Muted text color
				},
				accent: {
					DEFAULT: 'hsl(30, 80%, 95%)', // Very light warm accent
					foreground: 'hsl(30, 70%, 40%)' // Accent text color
				},
				card: {
					DEFAULT: 'hsl(30, 30%, 100%)', // Pure white card background
					foreground: 'hsl(20, 14%, 10%)' // Almost black text
				},
				destructive: {
					DEFAULT: 'hsl(0, 84%, 60%)', // Bright red for errors
					foreground: 'hsl(0, 0%, 98%)' // White text on destructive
				},
				amber: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
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
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1'
					},
					'100%': {
						opacity: '0'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(10px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-in-out',
				'fade-out': 'fade-out 0.3s ease-in-out',
				'slide-up': 'slide-up 0.4s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
