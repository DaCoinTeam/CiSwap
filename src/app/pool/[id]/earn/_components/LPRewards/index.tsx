"use client"
import React from "react"
import {
    Card,
    CardBody
} from "@nextui-org/react"
import LPRewardTable from "./LPRewardTable"
import { TitleDisplay } from "@app/_shared"

interface LPRewardLogsProps {
  className?: string;
}

const LPRewards = (props: LPRewardLogsProps) => {
    return (
        <div className={`flex gap-3 flex-col ${props.className}`}>
            <Card className="grow">
                <CardBody className="p-5">
                    <div className="flex flex-col gap-4">
                        <TitleDisplay size="lg" title="Rewards" />
                        <LPRewardTable/>
                    </div>         
                </CardBody>
            </Card>
        </div>
    )
}

export default LPRewards