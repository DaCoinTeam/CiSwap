import { nextui } from "@nextui-org/react"
import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
            }
        },
    },  
    darkMode: "class",
    plugins: [nextui(
        {
            themes: {
                light: {
                    colors: {
                        background: "rgb(244 244 245)",
                        primary: "rgb(20 184 166)",
                    },
                },
                dark: {
                    colors:{
                        primary: "rgb(20 184 166)"
                    }
                },
                dark2: {
                    colors:{
                        background: "rgb(24 24 27)"
                    }
                },
            }
        }
    )]
}
export default config
