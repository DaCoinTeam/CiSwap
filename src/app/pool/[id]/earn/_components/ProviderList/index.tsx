"use client"
import React from "react"
import {
    Card,
    CardBody
} from "@nextui-org/react"
import ProviderTable from "./ProviderTable"
import { TitleDisplay } from "@app/_shared"

interface ProviderListProps {
  className?: string;
}

const ProviderList = (props: ProviderListProps) => {
    return (
        <div className={`flex gap-3 flex-col ${props.className}`}>
            <Card className="grow">
                <CardBody className="p-5">
                    <div className="flex flex-col gap-4">
                        <TitleDisplay text="Providers" size="lg" />
                        <ProviderTable/>
                    </div>    
                </CardBody>
            </Card>
        </div>
    )
}

export default ProviderList