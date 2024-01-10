"use client"
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import React, { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState, setMetamaskWrongChainModal } from "@redux"
import { AppButton } from "@app/_shared"
import { MetamaskContext } from "@app/_hooks"
import { Web3 } from "web3"
import { MetamaskManager } from "@blockchain"

interface MetamaskWrongChainModalProps {
  className?: string;
}

const MetamaskWrongChainModal = (props: MetamaskWrongChainModalProps) => {
    const metamaskWrongChainModal = useSelector(
        (state: RootState) => state.modal.metamaskWrongChainModal
    )

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const dispatch: AppDispatch = useDispatch()

    const { ethereumState, web3State } = useContext(MetamaskContext)!

    const { ethereum } = ethereumState
    const { setWeb3 } = web3State

    const onClickSwitchChain = async () => {
        if (ethereum === null) return
        const manager = new MetamaskManager(ethereum)
        await manager.switchEthereumChain(chainId)
        const _web3 = new Web3(ethereum)
        setWeb3(_web3)
        dispatch(setMetamaskWrongChainModal(false))
    }

    const onClickDisconnectWallet = () => {
        setWeb3(null)
        dispatch(setMetamaskWrongChainModal(false))
    }

    return (
        <Modal
            size="xs"
            className={props.className}
            isOpen={!!metamaskWrongChainModal}
            hideCloseButton
            isDismissable
            isKeyboardDismissDisabled
        >
            <ModalContent>
                <ModalHeader className="p-5"> You are in wrong network </ModalHeader>
                <ModalBody className="p-5">
                    <div className="text-sm">
                        {" "}
            CiSwap currently only supported in Klaytn, Polygon{" "}
                    </div>
                </ModalBody>
                <ModalFooter className="p-5">
                    <div className="flex flex-col gap-3 w-full">
                        <AppButton
                            onClick={onClickSwitchChain}
                            text="Switch network in wallet"
                        />
                        <AppButton
                            onClick={onClickDisconnectWallet}
                            bordered
                            text="Disconnect wallet"
                        />
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default MetamaskWrongChainModal
