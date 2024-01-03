"use client"
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import React from "react"
import { useSelector } from "react-redux"
import { RootState, TransactionType } from "@redux"
interface SignatureConfirmationModalProps {
  className?: string;
}

const SignatureConfirmationModal = (props: SignatureConfirmationModalProps) => {
    const signatureConfirmationModal = useSelector(
        (state: RootState) => state.modal.signatureConfirmationModal
    )

    const renderApprove = () => {
        if (!signatureConfirmationModal) return null 
        if (signatureConfirmationModal.type !== TransactionType.Approve) return null
        return (
            <ModalContent>
                <ModalHeader className="p-5">
                Approve
                </ModalHeader>
                <ModalBody className="p-5">
             
                </ModalBody>
                <ModalFooter>
                    <div className="text-sm w-full text-center">
                        {" "}
Please process in your wallet{" "}
                    </div>
                </ModalFooter>
            </ModalContent>
        )
    }
    const renderSwap = () => {
        if (!signatureConfirmationModal) return null 
        if (signatureConfirmationModal.type !== TransactionType.Swap) return null
        return (
            <ModalContent>
                <ModalHeader className="p-5">
                Swap
                </ModalHeader>
                <ModalBody className="p-5">
             
                </ModalBody>
                <ModalFooter>
                    <div className="text-sm w-full text-center">
                        {" "}
Please process in your wallet{" "}
                    </div>
                </ModalFooter>
            </ModalContent>
        )
    }

    const renderBody = () => {
        if (!signatureConfirmationModal) return null 
        const typeToRender = {
            [TransactionType.Approve]: renderApprove,
            [TransactionType.Swap]: renderSwap
        }
        return typeToRender[signatureConfirmationModal.type]()
    }

    const isOpen = typeof signatureConfirmationModal === "object"

    return (
        <Modal
            size="xs"
            className={props.className}
            isOpen={isOpen}
            hideCloseButton
            isDismissable
            isKeyboardDismissDisabled
        >
            {renderBody()}
        </Modal>
    )
}

export default SignatureConfirmationModal
