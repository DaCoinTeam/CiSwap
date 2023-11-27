"use client"

import React from "react"
import { MetamaskIcon } from "./MetamaskIcon"
import { Button } from "@nextui-org/button"
import { useDispatch, useSelector } from "react-redux"
import Web3 from "web3"
import { setWeb3, AppDispatch, RootState, } from "@redux"

const ConnectWalletButton = () => {
    const dispatch : AppDispatch = useDispatch()
    const ethereum = useSelector((state: RootState) => state.blockchain.ethereum)

    const connectWallet = async (): Promise<void> => {
        try {
            if (ethereum == null) return 
            await ethereum.request({ method: "eth_requestAccounts", params: [] })
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