import { PoolSummary } from "../../../_hooks"
import { Card, CardBody } from "@nextui-org/react"
import React from "react"

interface PoolCardProps {
    summary: PoolSummary
}

const PoolCard = (props: PoolCardProps) => {
    return (
        <Card isPressable shadow="sm">
            <CardBody> {JSON.stringify(props)}</CardBody>
        </Card>
    )
}

export default PoolCard
