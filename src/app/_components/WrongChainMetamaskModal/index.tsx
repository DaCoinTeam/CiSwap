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
    const wrongChainMetamaskModal = useSelector(
        (state: RootState) => state.configuration.wrongChainMetamaskModal
    )

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const dispatch: AppDispatch = useDispatch()

    const metamaskContext = useContext(MetamaskContext)
    if (metamaskContext == null) return 
    const { web3State, ethereumState } = metamaskContext
    const { setWeb3 } = web3State
    const { ethereum } = ethereumState

    const _switchChain = async () => {
        if (ethereum == null) return
        const metamaskApis = new MetamaskApis(ethereum)
        await metamaskApis.switchEthereumChain(chainId)
        const _web3 = new Web3(ethereum)
        setWeb3(_web3)
        dispatch(setWrongChainMetamaskModalShow(false))
    }

    const _disconnectWallet = () => {
        setWeb3(null)
        dispatch(setWrongChainMetamaskModalShow(false))
    }  

    return (
        <Modal
            size="xs"
            className={props.className}
            isOpen={wrongChainMetamaskModal.isShow}
            hideCloseButton
            isDismissable
            isKeyboardDismissDisabled
        >
            <ModalContent>
                <ModalHeader className="p-5">
                    {" "}
                    <TitleDisplay
                        className="w-full text-center"
                        size="lg"
                        title={"You are in wrong network"}
                    />{" "}
                </ModalHeader>
                <ModalBody className="p-5">
                    <div className="text-sm">
                        {" "}
            CiSwap currently only supported in Klaytn, Polygon{" "}
                    </div>
                </ModalBody>
                <ModalFooter className="p-5">
                    <div className="flex flex-col gap-3 w-full">
                        <AppButton onPress={_switchChain} content="Switch network in wallet"/>
                        <AppButton onPress={_disconnectWallet} bordered content="Disconnect wallet"/>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default WrongChainMetamaskModal


