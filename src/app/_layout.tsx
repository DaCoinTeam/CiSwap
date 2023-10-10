"use client"
import { Mooli } from "next/font/google"
import React, { ReactNode, useEffect } from "react"
import { Navbar, Footer } from "./_components"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setAccount } from "@redux"
import { NextUIProvider, Spacer } from "@nextui-org/react"

export const mooli = Mooli({ weight: "400", subsets: ["latin"] })

const WrappedRootLayout = ({ children }: { children: ReactNode }) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    const web3 = useSelector((state: RootState) => state.blockchain.web3)
    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        if (web3 == null) {
            dispatch(setAccount(""))
            return
        }
        const handleEffect = async () => {
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]
            dispatch(setAccount(account))
        }
        handleEffect()
    }, [web3])

    return (
        <html lang="en" className={darkMode ? "dark" : "light"}>
            <body className={mooli.className}>
                <NextUIProvider>
                    <Navbar />
                    <Spacer y={12} />
                    <main>
                        <div className="max-w-[1024px] m-auto p-6">{children}</div>
                    </main>
                    <Spacer y={12} />
                    <Footer />
                </NextUIProvider>
            </body>
        </html>
    )
}
export default WrappedRootLayout
