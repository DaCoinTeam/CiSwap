"use client"
import React from "react"
import {
    Card,
    CardBody,
    Spacer
} from "@nextui-org/react"
import ProviderTable from "./ProviderTable"

interface ProviderListProps {
  className?: string;
}

const ProviderList = (props: ProviderListProps) => {
    return (
        <div className={`${props.className}`}>
            <div className="text-xl font-bold text-teal-500"> Providers </div>
            <Spacer y={3}/>
            <Card className="justify-self-stretch">
                <CardBody className="flex flex-cols justify-between">
                    <ProviderTable/>
                </CardBody>
            </Card>
        </div>
    )
}

export default ProviderList