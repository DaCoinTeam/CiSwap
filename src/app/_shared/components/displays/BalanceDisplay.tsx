import React from "react"
import { Skeleton } from "@nextui-org/react"
import numeral from "numeral"

interface BalanceDisplayProps {
  className?: string;
  balance: number;
  finishLoad?: boolean;
}

const BalanceDisplay = (props: BalanceDisplayProps) => {
    return (
        <div className={`${props.className} text-xs  flex gap-1`}>
            <span> Balance : </span>
            {props.finishLoad ? (
                <span>{numeral(props.balance).format("0.0a")}</span>
            ) : (
                <Skeleton className="h-4 w-4 rounded" />
            )}{" "}
        </div>
    )
}

export default BalanceDisplay
