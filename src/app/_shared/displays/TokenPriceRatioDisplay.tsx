import { TokenStateContext } from "@app/pool/[id]/layout"
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"
import { Skeleton, Spacer } from "@nextui-org/react"
import React, { useContext } from "react"
import { calculateRound } from "../../../utils/math"

interface TokenPriceRatioDisplayProps {
  className?: string;
  token0ImageUrl?: string;
  token1ImageUrl?: string;
}

const TokenPriceRatioDisplay = (props: TokenPriceRatioDisplayProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return 

    const _renderTrend = () => {
        const _percentage = tokenState.token0Price / tokenState.token0BasePrice - 1

        const _up = _percentage >= 0 ? true : false
        
        return _up ? 
            <div className="text-teal-500 flex gap-1 items-center">
                <ArrowUpIcon className="h-4 w-4"/>
                <span className="text-sm"> {calculateRound(Math.abs(_percentage) * 100, 3)} {" "} % </span>
            </div>
           
            :  
            <div className="text-red-500 flex gap-1  items-center">
                <ArrowDownIcon className="h-4 w-4"/>
                <span className="text-sm"> {calculateRound(Math.abs(_percentage) * 100, 3)} {" "} % </span>
            </div>
    }
    return (
        <div className={`${props.className}}`}>
            {tokenState.finishLoadWithoutConnected ? (
                <>
                    <div className="gap-2 font-bold">
                        <span className="text-3xl">
                            {" "}
                            {tokenState.token0Price}{" "}
                        </span>
                        <span className="text-lg">
                            {" "}
                            {tokenState.token0Symbol}/{tokenState.token1Symbol}{" "} 
                        </span>
                    </div>
                    <Spacer y={1}/>
                    {_renderTrend()}
                </>
            ) : (
                <>
                    <Skeleton className="h-10 w-48 rounded" />
                    <Spacer y={1}/>
                    <Skeleton className="h-6 w-20 rounded" />
                </>
            )}
        </div>
    )
}

export default TokenPriceRatioDisplay
