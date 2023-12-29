import React from "react"
import { Skeleton } from "@nextui-org/react"

interface BalanceDisplayProps {
  className?: string;
  balance: string;
  finishLoad?: boolean;
}

const BalanceDisplay = (props: BalanceDisplayProps) => {
    return (
        <div className={`${props.className} text-xs  flex gap-1`}>
            <span> Balance : </span>
            {props.finishLoad ? (
                <span>{props.balance}</span>
            ) : (
                <Skeleton className="h-4 w-4 rounded" />
            )}{" "}
        </div>
    )
}

export default BalanceDisplay
