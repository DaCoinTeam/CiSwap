import React from "react"
import { Skeleton } from "@nextui-org/react"

interface BalanceDisplayProps {
    className?: string,
    tokenBalance: string,
    finishLoad?: boolean
}

const BalanceDisplay = (props: BalanceDisplayProps) => {
    return (
        <>
            {!props.finishLoad 
                ? (<div className={`text-sm ${props.className}`}>
                    <span> Balance : </span>
                    <span>
                        {props.tokenBalance}
                    </span>
                </div>)
                : <Skeleton className="h-5 w-20  rounded"/>
            }
        </>
    )
}

export default BalanceDisplay