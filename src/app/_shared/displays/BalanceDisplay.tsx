import React from "react"
import { Skeleton } from "@nextui-org/react"

interface BalanceDisplayProps {
  className?: string;
  tokenBalance: number;
  finishLoad?: boolean;
}

const BalanceDisplay = (props: BalanceDisplayProps) => {
    return (
        <div className={`text-xs ${props.className} flex gap-1`}>
            <span> Balance : </span>
            {props.finishLoad ? (
                <span>{props.tokenBalance}</span>
            ) : (
                <Skeleton className="h-4 w-4  rounded" />
            )}{" "}
        </div>
    )
}

export default BalanceDisplay
