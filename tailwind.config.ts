import { nextui } from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(avatar|button|card|dropdown|navbar|progress|ripple|spinner|menu|divider|popover).js"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "dark-background": "linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%)",
      },
      backgroundBlendMode: {
        'multiply': 'multiply',
      },
    },
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: "#F6F5F5"
        }
      },
      dark: {
        colors: {
          background: '#31363F',
        }
      }
    }
  })]
  ,
};
export default config;
