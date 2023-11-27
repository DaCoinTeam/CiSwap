"use client"
import { Nunito } from "next/font/google"
import React, { ReactNode, useEffect } from "react"
import { Navbar, Footer, WaitSignModal } from "./_components"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setAccount, setDefaultPool, setEthereum } from "@redux"
import { NextUIProvider } from "@nextui-org/react"
import { FactoryContract } from "@blockchain"
import { chainInfos } from "@config"
import { ToastContainer } from "react-toastify"
import "./_css/ReactToastify.css"
import { IconContext } from "react-icons"
import MetaMaskSDK, { MetaMaskSDKOptions } from "@metamask/sdk"
import { useMetamask } from "./_hooks"

export const font = Nunito({ weight: "400", subsets: ["latin"] })

const WrappedRootLayout = ({ children }: { children: ReactNode }) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    const web3 = useSelector((state: RootState) => state.blockchain.web3)
    const chainName = useSelector((state: RootState) => state.blockchain.chainName)

    const dispatch: AppDispatch = useDispatch()

    const { a } = useMetamask()

    useEffect(() => {
        const handleEffect = async () => {
            const options: MetaMaskSDKOptions = {
                dappMetadata: {
                    name: "CiSwap",
                    url: "https://ciswap-dacointeam.vercel.app/"
                },
                extensionOnly: true
            }
            const MMSDK = new MetaMaskSDK(options)
            await MMSDK.init()
            const ethereum = MMSDK.getProvider()
            dispatch(setEthereum(ethereum))
        }
        handleEffect()
    }, [])

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
                                {children}
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
