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

interface DepositProps {
  className?: string;
}

const Deposit = (props: DepositProps) => {

    const [isOpen, setIsOpen] = useState(false)

    const _open = () => setIsOpen(true)
    const _close = () => setIsOpen(false)

    return (
        <>
            <AppButton
                className={`${props.className}`}
                text="Deposit"
                onClick={_open}
            />
            <Modal isOpen={isOpen} onClose={_close} size="sm">
                <ModalContent>
                    <FormikProviders>
                        <ModalHeader className="p-5">Deposit</ModalHeader>
                        <Divider />
                        <ModalBody className="p-5">
                            <MainSection />
                        </ModalBody>
                        <ModalFooter className="p-5">
                            <AppButton
                                submit
                                text="Deposit"
                                className="w-full"
                            />
                        </ModalFooter>
                    </FormikProviders>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Deposit
