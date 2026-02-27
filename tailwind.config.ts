import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          light: "#7C5CFF",
          DEFAULT: "#5B6FF6",
          dark: "#071033",
        },
        accent: "#21D4BD",
        muted: "#94A3B8",
        surface: "rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
