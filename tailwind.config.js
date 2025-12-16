
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./steps/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(prdx)-(cyan|blue|orange|red|gold|yellow|purple|deep-purple)/,
      variants: ['hover', 'group-hover', 'focus', 'active'],
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        // Specific PropertyDEX Palette
        prdx: {
          cyan: '#1BB6FF',       // Azzurro vivo (Primary)
          blue: '#004C99',       // Blu profondo
          orange: '#FF6A00',     // Arancione
          red: '#FF3C2A',        // Arancione/rosso variante
          gold: '#FFC400',       // Giallo oro
          yellow: '#FF9F00',     // Giallo-arancio variante
          purple: '#AB1CFF',     // Viola/magenta
          'deep-purple': '#7A00C8' // Viola scuro
        },
        // Legacy mapping for compatibility (gradual migration)
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#1BB6FF', // Mapped to Cyan
          600: '#004C99', // Mapped to Deep Blue
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        sim: {
            orange: '#FF6A00',     
            blue: '#004C99',       
            cyan: '#1BB6FF',       
            purple: '#AB1CFF',     
            green: '#FFC400',      // Using Gold for Success/Highlight in this theme
            yellow: '#FF9F00',     
            border: '#E2E8F0',     
            bg: '#FFFFFF',         
            
            // Functional aliases
            step: '#1BB6FF',       
            progress: '#FF6A00',   
            cta: '#004C99',        
            'cta-hover': '#1BB6FF', 
            ai: '#AB1CFF',         
            success: '#1BB6FF',    
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(27, 182, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
