import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins", ...fontFamily.sans],
        montserrat: ["var(--font-montserrat", ...fontFamily.sans],
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradieent(180.96deg, #00000 0.82%, #4A2800 129.1%)",
      },
      colors: {
        primary: {
          light: "#FCC182",
          DEFAULT: "#FA9021",
          dark: "#AF5B04",
        },
      },
    },
  },
  plugins: [],
};
export default config;
