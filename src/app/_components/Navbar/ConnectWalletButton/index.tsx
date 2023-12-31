"use client"

import React, { useContext } from "react"
import { MetamaskIcon } from "./MetamaskIcon"
import { Button } from "@nextui-org/button"
import Web3 from "web3"
import { MetamaskContext } from "@app/_hooks"
import { MetamaskApis } from "@blockchain"

const ConnectWalletButton = () => {
    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext === null) return
    const { web3State, ethereumState } = metamaskContext
    const { setWeb3 } = web3State
    const { ethereum } = ethereumState

    const connectWallet = async (): Promise<void> => {
        try {
            if (ethereum === null) return 
            const metamaskApis = new MetamaskApis(ethereum)
            await metamaskApis.requestAccounts()
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