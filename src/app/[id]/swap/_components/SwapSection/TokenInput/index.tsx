import React from "react"
import { BalanceDisplay, LoadingDisplay, TokenDisplay } from "@app/_shared"
import { Spacer, Textarea } from "@nextui-org/react"

const TokenInput = () => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <TokenDisplay tokenSymbol="USDT"/>
                <BalanceDisplay tokenBalance="12"/>
            </div>
            <Textarea />
            <Spacer y={0.5}/>
            <LoadingDisplay message="Calculating ..." />
        </div>
    )
}

export default TokenInput