"use client"
import React from "react"
import {
    Card,
    CardBody,
    Spacer
} from "@nextui-org/react"
import LPRewardTable from "./LPRewardTable"

interface LPRewardLogsProps {
  className?: string;
}

const LPRewardLogs = (props: LPRewardLogsProps) => {
    return (
        <div className={`${props.className}`}>
            <div className="text-xl font-bold text-teal-500"> Award Logs </div>
            <Spacer y={3}/>
            <Card>
                <CardBody className="flex flex-cols justify-between">
                    <LPRewardTable />
                </CardBody>
            </Card>
        </div>
    )
}

export default LPRewardLogs