import { PlusIcon } from "@heroicons/react/24/outline"
import {
    Card,
    CardBody,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react"
import React, { useState } from "react"
import { MainForm } from "./components"
import { FormikProviders } from "./hooks"

interface CreatePoolCardProps {}

const CreatePoolCard = (props: CreatePoolCardProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const onClickOpen = () => setIsOpen(true)
    const onClickClose = () => setIsOpen(false)

    return (
        <>
            <Card onPress={onClickOpen} isPressable shadow="sm">
                <CardBody className="grid place-items-center">
                    {" "}
                    <PlusIcon className="w-12 h-12 text-teal-500" />{" "}
                </CardBody>
            </Card>
           
            <Modal size="4xl" isOpen={isOpen} onClose={onClickClose}>
                <ModalContent>
                    <ModalHeader className="p-5">
                        <div className="font-bold text-lg">Create Pool</div>
                    </ModalHeader>
                    <Divider/>
                    <ModalBody className="p-5">
                        <FormikProviders>
                            <MainForm />
                        </FormikProviders>
                    </ModalBody>
                </  ModalContent>
            </Modal>
        </>
    )
}

export default CreatePoolCard
