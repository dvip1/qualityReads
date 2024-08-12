import { nextui } from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(autocomplete|avatar|badge|button|card|dropdown|input|modal|navbar|pagination|progress|skeleton|toggle|popover|ripple|spinner|listbox|divider|scroll-shadow|menu).js"
  ],
  theme: {
    extend: {
    },
  },
  plugins: [nextui({
    prefix: "nextui",
    defaultTheme: "light",
    defaultExtendTheme: "light",
    themes: {
      light: {
        colors: {
          background: "#F6F5F5"
        }
      },
      dark: {
        colors: {
          background: '#3D3B40',
        }
      },
    }
  })]
  ,
};
export default config;
