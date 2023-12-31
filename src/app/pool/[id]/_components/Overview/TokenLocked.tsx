"use client"

import React, { useContext } from "react"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import { TitleDisplay } from "@app/_shared"
import TokenLockedDetails from "./TokenLockedDetails"
import { PoolContext } from "../../_hooks"

interface TokenLockedProps {
    clasName? : string
}

const TokenLocked = (props: TokenLockedProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return
    const { tokenState } = poolContext
    return (
        <div className = {`${props.clasName}`}>
            <TitleDisplay title="Total Tokens Locked"/>
            <Spacer y={2}/>
            <Card>
                <CardBody className="p-3">
                    <TokenLockedDetails tokenLocked={tokenState.token0Locked} symbol={tokenState.token0Symbol}/>
                    <Spacer y={2}/>
                    <TokenLockedDetails tokenLocked={tokenState.token1Locked} symbol={tokenState.token1Symbol}/>
                </CardBody>
            </Card>
        </div>
 
    )
}

export default TokenLocked
