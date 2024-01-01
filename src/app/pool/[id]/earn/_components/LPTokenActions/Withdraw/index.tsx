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
import { AppButton } from "@app/_shared"
import MainSection from "./MainSection"
import FormikProviders from "./FormikProviders"

interface WithdrawProps {
  className?: string;
}

const Withdraw = (props: WithdrawProps) => {

    const [isOpen, setIsOpen] = useState(false)

    const _open = () => setIsOpen(true)
    const _close = () => setIsOpen(false)

    return (
        <>
            <AppButton
                className={`${props.className}`}
                text="Withdraw"
                bordered
                onClick={_open}
            />
            <Modal isOpen={isOpen} onClose={_close} size="sm">
                <ModalContent>
                    <FormikProviders>
                        <ModalHeader className="p-5">Withdraw</ModalHeader>
                        <Divider />      
                        <ModalBody className="p-5 gap-6">
                            <MainSection />
                        </ModalBody>
                        <ModalFooter className="p-5">
                            <AppButton
                                typeSubmit
                                content="Withdraw"
                                className="w-full"
                            />
                        </ModalFooter>
                    </FormikProviders>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Withdraw
