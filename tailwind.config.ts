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
        primary: "#279076",
        "primary-dark": "#369CAC",
        "primary-light": "#DEF7F1",
        background: "var(--background)",
        foreground: "var(--foreground)",
        error: "#d82e15",
      },
    },
  },
  plugins: [],
} satisfies Config;
