"use client"
import MetaMaskSDK, { MetaMaskSDKOptions, SDKProvider } from "@metamask/sdk"
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch, setAccount } from "@redux"
import Web3 from "web3"
import { RegisteredSubscription } from "web3-eth"
import { ContextProps } from "@app/_shared"
import React from "react"


export interface MetamaskContextProps{
    ethereumState: {
        ethereum: SDKProvider | null,
        setEthereum: Dispatch<SetStateAction<SDKProvider | null>>
    },
    web3State: {
        web3: Web3<RegisteredSubscription> | null,
        setWeb3: Dispatch<SetStateAction<Web3<RegisteredSubscription> | null>>
    }
}

export const MetamaskContext = createContext<MetamaskContextProps | null>(null)

const MetamaskProviders = (props: ContextProps) => {
    const [ethereum, setEthereum] = useState< SDKProvider|null >(null)
    const [web3, setWeb3] = useState< Web3<RegisteredSubscription>|null >(null)
    const dispatch: AppDispatch = useDispatch()

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
            const _ethereum = MMSDK.getProvider()
            setEthereum(_ethereum)
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
    return (
        <MetamaskContext.Provider value={
            {
                ethereumState:{
                    ethereum,
                    setEthereum
                },
                web3State: {
                    web3,
                    setWeb3
                }
            }
        }>
            {props.children}
        </MetamaskContext.Provider>
    )
}

export default MetamaskProviders

//     useEffect(() => {
//         if (ethereum == null) return 
//         const handleChainChanged = (chainId: unknown) => {
//             console.log(chainId)
//         }
//         const handleEffect = async () => {
//             ethereum.on("chainChanged", handleChainChanged)
//         }
//         handleEffect()
//         return (() => {
//             ethereum.removeListener("chainChanged", handleChainChanged)
//         })
//     }, [ethereum])
//     return { a: "1"}
// }