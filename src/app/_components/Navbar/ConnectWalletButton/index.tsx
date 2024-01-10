"use client"

import React, { useContext } from "react"
import { MetamaskIcon } from "./MetamaskIcon"
import { Button } from "@nextui-org/button"
import Web3 from "web3"
import { MetamaskContext } from "@app/_hooks"
import { MetamaskManager } from "@blockchain"

const ConnectWalletButton = () => {
    const { web3State, ethereumState } =  useContext(MetamaskContext)!
    const { setWeb3 } = web3State
    const { ethereum } = ethereumState

    const connectWallet = async (): Promise<void> => {
        try {
            if (ethereum === null) return 
            const manager = new MetamaskManager(ethereum)
            await manager.requestAccounts()
            const web3 = new Web3(ethereum)
            setWeb3(web3)

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