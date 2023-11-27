"use client"
import { Nunito } from "next/font/google"
import React, { useContext, useEffect } from "react"
import { Navbar, Footer, WaitSignModal } from "./_components"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setDefaultPool } from "@redux"
import { NextUIProvider } from "@nextui-org/react"
import { FactoryContract } from "@blockchain"
import { chainInfos } from "@config"
import { ToastContainer } from "react-toastify"
import "./_css/ReactToastify.css"
import { IconContext } from "react-icons"
import { MetamaskContext } from "./_hooks/MetamaskProviders"
import { ContextProps } from "./_shared"

export const font = Nunito({ weight: "400", subsets: ["latin"] })

const WrappedRootLayout = (props: ContextProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return 
    const { web3State } = metamaskContext
    const { web3 } = web3State

    const chainName = useSelector((state: RootState) => state.blockchain.chainName)

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        const handleEffect = async () => {
            const factoryContract = new FactoryContract(chainName)
            const pairs = await factoryContract.getPairs(
                chainInfos[chainName].exchangeTokenAddress, 
                chainInfos[chainName].stableTokenAddresses[0])
            if (pairs == null || !pairs.length) return    
            dispatch(setDefaultPool(pairs[0]))
        }
        handleEffect()
    }, [web3])

    return (
        <html lang="en" className={darkMode ? "dark" : "light"}>
            <body className={font.className}>
                <NextUIProvider>
                    <IconContext.Provider value={{ className: "w-5 h-5" }}>
                        <main className="flex flex-col min-h-screen">
                            <Navbar />
                            <section className="flex-1">
                                {props.children}
                            </section>
                            <Footer />
                            <WaitSignModal />
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


