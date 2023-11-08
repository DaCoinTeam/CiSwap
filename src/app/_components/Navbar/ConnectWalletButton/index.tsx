"use client"

import React from "react"
import { MetamaskIcon } from "./MetamaskIcon"
import { Button } from "@nextui-org/button"
import { useDispatch } from "react-redux"
import Web3 from "web3"
import { setWeb3, AppDispatch } from "@redux"
import MetaMaskSDK, { MetaMaskSDKOptions } from "@metamask/sdk"

const ConnectWalletButton = () => {
    const dispatch : AppDispatch = useDispatch()
    
    const connectWallet = async (): Promise<void> => {
        try {
            const options: MetaMaskSDKOptions = {
                dappMetadata: {
                    name: "CiSwap",
                },
                extensionOnly: true
            }
            const MMSDK = new MetaMaskSDK(options)
            await MMSDK.init()
            const ethereum = MMSDK.getProvider()

            await ethereum.request({ method: "eth_requestAccounts", params: [] })
            //await window.ethereum.request({ method: "eth_requestAccounts" })

            const web3 = new Web3(ethereum)

            dispatch(setWeb3(web3))
        } catch (error) {
		  console.error("Error connecting to MetaMask:", error)
        }
    }
    return (<Button color="default" 
        variant="light" 
        startContent={<MetamaskIcon/>}
        onPress={connectWallet}
    >
        Connect Wallet
    </Button>)
}

export default ConnectWalletButton