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
        textdefault: "var(--default-white)",
        textgray: "var(--default-gray)",
        backgrounddefault: "var(--default-white)",
        backgroundgray: "var(--default-gray)",
        backhoverbutton: "var(--button-hover)",
        backmenu: "var(--menu-vertical-bg)",
        backpage: "var(--page-bg)",
        backbuttondefault: "var(--button-default-bg)",
        backbuttonsecondary: "var(--button-secondary-bg)",

      },
    },
  },
  plugins: [],
} satisfies Config;
