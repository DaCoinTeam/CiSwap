"use client"
import React from "react"
import {
    Card,
    CardBody
} from "@nextui-org/react"
import LPRewardTable from "./LPRewardTable"

interface LPRewardLogsProps {
  className?: string;
}

const LPRewardLogs = (props: LPRewardLogsProps) => {
    return (
        <div className={`flex gap-3 flex-col ${props.className}`}>
            <div className="text-xl font-bold text-teal-500"> Rewards Logs </div>
            <Card className="grow">
                <CardBody className="flex flex-cols justify-between">
                    <LPRewardTable/>
                </CardBody>
            </Card>
        </div>
    )
}

export default LPRewardLogs