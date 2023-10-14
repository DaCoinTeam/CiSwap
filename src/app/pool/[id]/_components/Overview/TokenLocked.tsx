"use client"

import React from "react"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import { TitleDisplay } from "@app/_shared"
import TokenLockedDetails from "./TokenLockedDetails"

interface TokenLockedProps {
    clasName? : string,
    token0Symbol: string,
    token1Symbol: string,
    token0Locked: number,
    token1Locked: number,
    token0ImageUrl?: string,
    token1ImageUrl?: string,
}

const TokenLocked = (props: TokenLockedProps) => {
    return (
        <div className = {`${props.clasName}`}>
            <TitleDisplay title="Total Tokens Locked"/>
            <Spacer y={2}/>
            <Card>
                <CardBody className="p-3">
                    <TokenLockedDetails tokenLocked={1000} tokenSymbol="ADD"/>
                    <Spacer y={2}/>
                    <TokenLockedDetails tokenLocked={1000} tokenSymbol="BUSD"/>
                </CardBody>
            </Card>
        </div>
 
    )
}

export default TokenLocked
