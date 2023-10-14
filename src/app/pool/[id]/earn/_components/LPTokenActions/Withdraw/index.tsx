"use client"
import {
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton } from "@app/_shared"

interface WithdrawProps {
  className?: string;
}

const Withdraw = (props: WithdrawProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const [isOpen, setIsOpen] = useState(false)

    const _open = () => setIsOpen(true)
    const _close = () => setIsOpen(false)

    return (
        <>
            <AppButton
                className={`${props.className}`}
                darkMode={darkMode}
                content="Withdraw"
                bordered
                onPress={_open}
            />
            <Modal isOpen={isOpen} onClose={_close}>
                <ModalContent>
                    <ModalHeader className="p-5">Select Token</ModalHeader>
                    <Divider />
                    <ModalBody className="p-5 gap-6"></ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Withdraw
