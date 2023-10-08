"use client"
import "./globals.css"
import { Inter } from "next/font/google"
import React from "react"
import { Navbar, Footer } from "./_components"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { NextUIProvider } from "@nextui-org/react"

const inter = Inter({ subsets: ["latin"] })

const WrappedRootLayout = ({ children }: { children: React.ReactNode }) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    return (
        <html lang="en" className= {darkMode ? "dark" : "light"}>
            <body className= {inter.className}>
                <NextUIProvider>
                    <Navbar />
                    {children}
                </NextUIProvider>
                <Footer />
            </body>
        </html>
    )
}
export default WrappedRootLayout
