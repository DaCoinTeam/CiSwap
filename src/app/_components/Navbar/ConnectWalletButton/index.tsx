"use client"

import React from "react"
import { MetamaskIcon } from "./MetamaskIcon"
import { Button } from "@nextui-org/button"
import { useDispatch } from "react-redux"
import Web3 from "web3"
import { setWeb3, AppDispatch } from "@redux"

const ConnectWalletButton = () => {
    const dispatch : AppDispatch = useDispatch()
    
    const connectWallet = async (): Promise<void> => {
        try {
		    if (typeof window.ethereum !== "undefined") {
                await window.ethereum.request({ method: "eth_requestAccounts" })

                const provider = window.ethereum
                const web3 = new Web3(provider)

                dispatch(setWeb3(web3))
            } else {
                console.error("MetaMask is not installed or not available")
            }
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