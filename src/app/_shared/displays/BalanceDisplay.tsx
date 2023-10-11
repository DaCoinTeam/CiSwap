import React from "react"
import { Skeleton } from "@nextui-org/react"

interface BalanceDisplayProps {
    className?: string,
    tokenBalance: number,
    finishLoad?: boolean
}

const BalanceDisplay = (props: BalanceDisplayProps) => {
    return (
        <>
            {props.finishLoad 
                ? (<div className={`text-xs ${props.className}`}>
                    <span> Balance : </span>
                    <span>
                        {props.tokenBalance}
                    </span>
                </div>)
                : <Skeleton className="h-4 w-12  rounded"/>
            }
        </>
    )
}

export default BalanceDisplay