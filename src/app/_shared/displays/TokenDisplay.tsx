import { Image, Skeleton } from "@nextui-org/react"
import React from "react"

interface TokenDisplayProps {
    className?: string,
    tokenSymbol: string,
    tokenImageUrl?: string
    finishLoad?: boolean
}

const TokenDisplay = (props: TokenDisplayProps) => {
    return (
        <>
            { !props.finishLoad 
                ? (<div className={`flex gap-2 items-center ${props.className}`}>
                    <Image radius="full" className="w-5 h-5" src = {props.tokenImageUrl ?? "/images/QuestionMarkCircle.svg"}/>        
                    <span className="text-sm font-bold">
                        {props.tokenSymbol}
                    </span>
                </div>)
                : <Skeleton className="h-5 w-12 rounded"/>
            }
        </>
    )
}

export default TokenDisplay
