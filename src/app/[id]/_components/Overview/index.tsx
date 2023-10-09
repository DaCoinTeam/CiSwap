"use client"

import React from "react"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import DataWidgetDisplay from "@app/_shared/displays/DataWidgetDisplay"
import TokenLocked from "./TokenLocked"
import { ViewOnExplorer } from "@app/_shared"

interface OverviewProps {
    clasName? : string
}

const Overview = (props: OverviewProps) => {
    return (
        <Card className = {`${props.clasName}`}>
            <CardBody>
                <ViewOnExplorer hexString="123"/>

                <Spacer y={6}/>
                <TokenLocked token0Symbol={""} token1Symbol={""} token0Locked={0} token1Locked={0} />
            </CardBody>
        </Card>
    )
}

export default Overview
