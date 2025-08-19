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
        backcolumtable: "var(--table-colum-bg)",
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
        tablehover: "var(--table-default-hover)",

      },
    },
    keyframes: {
      hide: {
        from: { opacity: "1" },
        to: { opacity: "0" },
      },
      slideDownAndFade: {
        from: { opacity: "0", transform: "translateY(-6px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
      slideLeftAndFade: {
        from: { opacity: "0", transform: "translateX(6px)" },
        to: { opacity: "1", transform: "translateX(0)" },
      },
      slideUpAndFade: {
        from: { opacity: "0", transform: "translateY(6px)" },
        to: { opacity: "1", transform: "translateY(0)" },
      },
      slideRightAndFade: {
        from: { opacity: "0", transform: "translateX(-6px)" },
        to: { opacity: "1", transform: "translateX(0)" },
      },
    },
    animation: {
      hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      slideDownAndFade:
        "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      slideLeftAndFade:
        "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      slideRightAndFade:
        "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
  plugins: [],
} satisfies Config;
