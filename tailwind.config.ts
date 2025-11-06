
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
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				},
				// 3AMG Brand Colors from logo
				'3amg': {
					orange: '#FF6B35',
					'orange-dark': '#E55A2B',
					'orange-light': '#FF8A5C',
					red: '#FF4500',
					purple: '#8B5CF6',
					'purple-dark': '#7C3AED',
					'purple-light': '#A78BFA',
					dark: '#1A1A1A',
					'dark-light': '#2D2D2D',
					binary: '#FF6B35'
				},
				// Modern Blue-Purple Palette
				'modern': {
					'blue-deep': '#1E3A8A',
					'blue-dark': '#1E40AF',
					'blue-primary': '#3B82F6',
					'purple-vibrant': '#A855F7',
					'pink-bright': '#EC4899',
					'turquoise': '#14B8A6'
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
				'binary-float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)', opacity: '0.3' },
					'50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: '0.6' }
				},
				'binary-rain': {
					'0%': { transform: 'translateY(-100vh)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(100vh)', opacity: '0' }
				},
				'float-tech': {
					'0%, 100%': { transform: 'translateY(0px) rotateZ(0deg)', opacity: '0.2' },
					'50%': { transform: 'translateY(-30px) rotateZ(180deg)', opacity: '0.4' }
				},
				'pulse-orange': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.1)' }
				},
				'grid-move': {
					'0%': { transform: 'translate(0, 0)' },
					'100%': { transform: 'translate(50px, 50px)' }
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
						transform: 'scale(1)'
					},
					'50%': { 
						boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)',
						transform: 'scale(1.05)'
					}
				},
				'text-glow': {
					'0%, 100%': { 
						textShadow: '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)'
					},
					'50%': { 
						textShadow: '0 0 30px rgba(139, 92, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'binary-float': 'binary-float 3s ease-in-out infinite',
				'binary-rain': 'binary-rain 4s linear infinite',
				'float-tech': 'float-tech 4s ease-in-out infinite',
				'pulse-orange': 'pulse-orange 2s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'grid-move': 'grid-move 20s linear infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
				'text-glow': 'text-glow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-3amg': 'linear-gradient(135deg, #FF6B35 0%, #8B5CF6 50%, #7C3AED 100%)',
				'gradient-3amg-orange': 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
				'gradient-3amg-purple': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
				'tech-pattern': 'radial-gradient(circle at 25% 25%, #FF6B35 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8B5CF6 0%, transparent 50%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
