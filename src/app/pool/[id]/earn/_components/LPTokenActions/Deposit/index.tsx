"use client"
import {
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import React, { useContext, useState } from "react"
import { AppButton } from "@app/_shared"
import MainSection from "./MainSection"
import FormikProviders from "./formik"
import { TokenStateContext } from "../../../../layout"

interface DepositProps {
  className?: string;
}

const Deposit = (props: DepositProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const [isOpen, setIsOpen] = useState(false)

    const _open = () => setIsOpen(true)
    const _close = () => setIsOpen(false)

    return (
        <>
            <AppButton
                className={`${props.className}`}
                content="Deposit"
                onPress={_open}
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
                                typeSubmit
                                content="Deposit"
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
