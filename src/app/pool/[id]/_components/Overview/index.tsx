"use client"

import React, { useContext } from "react"
import { Card, CardBody } from "@nextui-org/react"
import TokenLocked from "./TokenLocked"
import LiquidityDisplay from "./LiquidityDisplay"
import { PoolContext } from "../../_hooks"
import { calculateRedenomination } from "@utils"

interface OverviewProps {
    className? : string
}

const Overview = (props: OverviewProps) => {

    return (
        <Card className = {`${props.className}`}>
            <CardBody className="flex flex-col justify-between p-5">
                <div>
                    <LiquidityDisplay />

                </div>
                <TokenLocked />
            </CardBody>
        </Card>
    )
}

export default Overview
