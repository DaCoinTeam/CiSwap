"use client"

import React, { useContext } from "react"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import TokenLocked from "./TokenLocked"
import { ViewOnExplorer } from "@app/_shared"
import { TokenStateContext } from "../../layout"

interface OverviewProps {
    clasName? : string
}

const Overview = (props: OverviewProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return
    return (
        <Card className = {`${props.clasName}`}>
            <CardBody>
                <ViewOnExplorer hexString="12233"/>

                <Spacer y={6}/>
                <TokenLocked />
            </CardBody>
        </Card>
    )
}

export default Overview
