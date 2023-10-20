"use client"

import React, { useContext } from "react"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import TokenLocked from "./TokenLocked"
import { DataWidgetDisplay, ViewOnExplorer } from "@app/_shared"
import { TokenStateContext } from "../../layout"

interface OverviewProps {
    clasName? : string
}

const Overview = (props: OverviewProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return
    return (
        <Card className = {`${props.clasName}`}>
            <CardBody className="flex flex-col justify-between">
                <ViewOnExplorer hexString="12233"/>
                <div>
                    <DataWidgetDisplay
                        title="Liquidity"
                        value={123123}
                        finishLoad={true} />
                    <Spacer y={6}/>
                    <DataWidgetDisplay
                        title="Volume 24h"
                        value={123123}
                        finishLoad={true} 
                    />
                    <Spacer y={6}/>
                    <TokenLocked />
                </div>
            </CardBody>
        </Card>
    )
}

export default Overview
