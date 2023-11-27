"use client"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "@redux"
import { TitleDisplay } from "@app/_shared"
interface WaitSignModalProps {
    className? : string
}

const WaitSignModal = (props: WaitSignModalProps) => {
    const waitSignModal = useSelector((state: RootState) => state.configuration.waitSignModal)
    return ( <Modal size="xs" className={props.className} isOpen={waitSignModal.isShow} hideCloseButton isDismissable isKeyboardDismissDisabled>
        <ModalContent>
            <ModalHeader className="p-5"> <TitleDisplay className="w-full text-center" size="lg" title={waitSignModal.title}/>  </ModalHeader>
            <ModalBody className="p-5">
                <div className="text-sm w-full text-center"> Please process in your wallet </div>
            </ModalBody>
        </ModalContent>
    </Modal>)
}

export default WaitSignModal