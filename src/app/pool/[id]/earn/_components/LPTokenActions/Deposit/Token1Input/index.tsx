import React, { useEffect } from "react"
import { BalanceDisplay, LoadingDisplay, NumberTextarea, TokenDisplay } from "@app/_shared"
import { Spacer } from "@nextui-org/react"

const Token1Input = () => {
    useEffect(
        () => {
            
        }, []
    )
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <TokenDisplay tokenSymbol="USDT"/>
                <BalanceDisplay tokenBalance={12}/>
            </div>
            <NumberTextarea value="" onValueChange={() => {}} />
            <Spacer y={0.5}/>
            <LoadingDisplay message="Calculating ..." />
        </div>
    )
}

export default Token1Input