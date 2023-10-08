import { Skeleton } from "@nextui-org/react"
import React from "react"

interface TokenPriceRatioDisplayProps {
  className?: string;
  token0Symbol: string;
  token1Symbol: string;
  token0ImageUrl?: string;
  token1ImageUrl?: string;
  token0BasePrice?: number;
  token0Price: number;
  finishLoad?: boolean;
}

const TokenPriceRatioDisplay = (props: TokenPriceRatioDisplayProps) => {
    return (
        <>
            {!props.finishLoad ? (
                <div className="gap-2 font-bold">
                    <span className="text-5xl">
                        {" "}
                        {props.token0Price}{" "}
                    </span>
                    <span className="text-xl">
                        {" "}
                        {props.token0Symbol}/{props.token1Symbol}{" "}
                    </span>
                </div>
            ) : (
                <Skeleton className="h-5 w-12 rounded" />
            )}
        </>
    )
}

export default TokenPriceRatioDisplay
