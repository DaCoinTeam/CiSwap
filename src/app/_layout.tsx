"use client"
import { Open_Sans } from "next/font/google"
import React, { useMemo } from "react"
import {
    Navbar,
    Footer,
    SignatureConfirmationModal,
    WrongChainMetamaskModal,
} from "./_components"
import { NextUIProvider } from "@nextui-org/react"
import { ToastContainer } from "react-toastify"
import "./_css/ReactToastify.css"
import { IconContext } from "react-icons"
import { ProvidersProps } from "./_shared"
import useDarkMode from "use-dark-mode"
import { storage } from "@utils"

export const font = Open_Sans({ weight: "400", subsets: ["latin"] })

const WrappedRootLayout = (props: ProvidersProps) => {
    const darkMode = useDarkMode(storage.getDarkMode())

    const iconContext = useMemo(() => {
        return { className: "w-5 h-5" }
    }, [])

    return (
        <html lang="en" className={darkMode.value ? "dark" : "light"}>
            <body className={font.className}>
                <NextUIProvider>
                    <IconContext.Provider value={iconContext}>
                        <main className="flex flex-col min-h-screen">
                            <Navbar />
                            <section className="flex-1">{props.children}</section>
                            <Footer />
                            <SignatureConfirmationModal />
                            <WrongChainMetamaskModal />
                            <ToastContainer
                                position="top-right"
                                autoClose={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                            />
                        </main>
                    </IconContext.Provider>
                </NextUIProvider>
            </body>
        </html>
    )
}
export default WrappedRootLayout
