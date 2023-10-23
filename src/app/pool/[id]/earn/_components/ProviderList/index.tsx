"use client"
import React from "react"
import {
    Card,
    CardBody
} from "@nextui-org/react"
import ProviderTable from "./ProviderTable"

interface ProviderListProps {
  className?: string;
}

const ProviderList = (props: ProviderListProps) => {
    return (
        <div className={`flex gap-3 flex-col ${props.className}`}>
            <div className="text-xl font-bold text-teal-500"> Providers </div>
            <Card className="grow">
                <CardBody className="flex flex-cols justify-between">
                    <ProviderTable/>
                </CardBody>
            </Card>
        </div>
    )
}

export default ProviderList