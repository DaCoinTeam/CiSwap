import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import {
    Button,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react"
import React, { useState } from "react"
import SlippageTolerance from "./SlippageTolerance"
import TxDeadline from "./TxDeadline"
const Settings = () => {
    const [isOpen, setIsOpen] = useState(false)
    const onClickOpen = () => setIsOpen(true)
    const onClickClose = () => {
        setIsOpen(false)
    }
    return (
        <>
            <Button isIconOnly size="sm" variant="light" onPress={onClickOpen}>
                <Cog6ToothIcon className="w-6 h-6 text-teal-500" />
            </Button>

            <Modal isOpen={isOpen} size="lg" onClose={onClickClose}>
                <ModalContent>
                    <ModalHeader className="p-5">Settings</ModalHeader>
                    <Divider />
                    <ModalBody className="p-5 gap-6">
                        <div className="flex flex-col gap-12"> 
                            <SlippageTolerance />
                            <TxDeadline />
                        </div>
                    </ModalBody>
                    <ModalFooter className="p-5"></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Settings
