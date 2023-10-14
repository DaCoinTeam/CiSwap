"use client"

import React from "react"
import { Avatar } from "@nextui-org/react"

interface TokenLockedDetailsProps {
    clasName? : string,
    tokenSymbol: string,
    tokenLocked: number,
    tokenImageUrl?: string
}

const TokenLockedDetails = (props: TokenLockedDetailsProps) => {
    return (
        <div className={`flex items-center justify-between ${props.clasName}`}>
            <div className="flex gap-2 items-center">
                <Avatar
                    className="w-5 h-5"
                    src={props.tokenImageUrl ?? "/images/QuestionMarkCircle.svg"}
                />
                <span className="font-bold text-sm">{props.tokenSymbol}</span>
            </div>
            <span className="text-sm"> {props.tokenLocked} </span>
        </div>
 
    )
}

export default TokenLockedDetails
