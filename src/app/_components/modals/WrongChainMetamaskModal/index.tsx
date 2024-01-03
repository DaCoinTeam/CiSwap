"use client"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setWrongChainMetamaskModalShow } from "@redux"
import { AppButton, TitleDisplay } from "@app/_shared"
import { MetamaskContext } from "@app/_hooks"
import { Web3 } from "web3"
import { MetamaskApis } from "@blockchain"

interface MetamaskModalProps {
  className?: string;
}

const WrongChainMetamaskModal = (props: MetamaskModalProps) => {
    // const wrongChainMetamaskModal = useSelector(
    //     (state: RootState) => state.configuration.wrongChainMetamaskModal
    // )

    // const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    // const dispatch: AppDispatch = useDispatch()

    // const metamaskContext = useContext(MetamaskContext)
    // if (metamaskContext === null) return 
    // const { web3State, ethereumState } = metamaskContext
    // const { setWeb3 } = web3State
    // const { ethereum } = ethereumState

    // const _switchChain = async () => {
    //     if (ethereum === null) return
    //     const metamaskApis = new MetamaskApis(ethereum)
    //     await metamaskApis.switchEthereumChain(chainId)
    //     const _web3 = new Web3(ethereum)
    //     setWeb3(_web3)
    //     dispatch(setWrongChainMetamaskModalShow(false))
    // }

    // const _disconnectWallet = () => {
    //     setWeb3(null)
    //     dispatch(setWrongChainMetamaskModalShow(false))
    // }  

    return (
      <div></div>
    )
}

export default WrongChainMetamaskModal


