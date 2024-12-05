import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    screens: {
      xs: '350px',
      sm: '576px',
      md: '768px',
      lg: '880px',
      xl: '992px',
      xxl: '1024px',
      xxxl: '1200px',
      xxxxl: '1400px'
    },
    fontFamily: {
      geistSans: 'var(--font-geist-sans)',
      geistMono: 'var(--font-geist-mono)',
    }
  },
  plugins: [],
} satisfies Config;
