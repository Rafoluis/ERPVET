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
        foreground: "var(--foreground)",
        textdefault: "var(--default-white)",
        textdark: "var(--default-text-dark)",
        backhoverbutton: "var(--button-hover)",
        backgrounddefault: "var(--default-white)",
        backgroundgray: "var(--default-gray)",
        backselectbutton: "var(--blue-dark-select-bg)",
        backmenu: "var(--blue-dark-bg)",
        backpage: "var(--page-bg)",
        backbuttondefault: "var(--button-default-bg)",
        backbuttonsecondary: "var(--button-secondary-bg)",
        backbuttongreen: "var(--button-green-bg)",
        backbuttonyellow: "var(--button-yellow-bg)",
        backbuttonred: "var(--button-red-bg)",
        backnavbar: "var(--blue-navbar-bg)",
        textblue: "var(--blue-text)",
        textred: "var(--red-text)",

      },
    },
  },
  plugins: [],
} satisfies Config;
