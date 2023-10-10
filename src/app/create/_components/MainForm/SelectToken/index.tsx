"use client"
import {
    Button,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import React, { useState } from "react"
import SelectStableToken from "./SelectStableToken"

const SelectToken = () => {
    const [isOpen, setIsOpen] = useState(false)

    const _open = () => setIsOpen(true)
    const _close = () => setIsOpen(false)

    const [tempTokenAddress, setTempTokenAddress] = useState("")
    const [tokenAddress, setTokenAddress] = useState("")

    return (
        <>
            <Button variant="flat" onPress={_open}>Open Modal</Button>
            <Modal isOpen={isOpen} onClose={_close}>
                <ModalContent>
                    <ModalHeader className="p-5">Select Token</ModalHeader>
                    <Divider/>
                    <ModalBody className="p-5">
                        <Input label="Token Address" />
                        <SelectStableToken />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onPress={_close}>
              Action
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default SelectToken
