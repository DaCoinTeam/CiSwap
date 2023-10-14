"use client"
import { Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { AppButton } from "@app/_shared"
import Token1Input from "./Token1Input"

interface DepositProps {
  className?: string;
}

const Deposit = (props: DepositProps) => {
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
                content="Deposit"
                onPress={_open}
            />
            <Modal isOpen={isOpen} onClose={_close}>
                <ModalContent>
                    <ModalHeader className="p-5">Deposit</ModalHeader>
                    <Divider />
                    <ModalBody className="p-5">
                        <Token1Input />
                    </ModalBody>
                    <ModalFooter>
            
                    </ModalFooter>
                </ModalContent>
            </Modal> 
        </>
    )
}

export default Deposit
