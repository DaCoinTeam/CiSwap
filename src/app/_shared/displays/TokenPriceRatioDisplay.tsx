import { TokenStateContext } from "@app/pool/[id]/layout"
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline"
import { Skeleton } from "@nextui-org/react"
import React, { useContext } from "react"
import { calculateRound } from "../../../utils/math"

interface TokenPriceRatioDisplayProps {
  className?: string;
  token0ImageUrl?: string;
  token1ImageUrl?: string;
  style? : "style1" | "style2"
}

const TokenPriceRatioDisplay = (props: TokenPriceRatioDisplayProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return 

    let _style = props.style
    if (_style == undefined) _style = "style1"

    const _renderTrend = () => {
        const _percentage = tokenState.token0Price / tokenState.token0BasePrice - 1

        const _up = _percentage >= 0 ? true : false
        
        return _up ? 
            <div className="text-teal-500 flex gap-1 items-center">
                <ArrowUpIcon className="h-4 w-4"/>
                <span className="text-sm"> {calculateRound(Math.abs(_percentage) * 100, 3)} {" "} % </span>
            </div>
           
            :  
            <div className="text-red-500 flex   items-center flex">
                <ArrowDownIcon className="h-4 w-4"/>
                <span className="text-sm"> {calculateRound(Math.abs(_percentage) * 100, 3)} {" "} % </span>
            </div>
    }

    const _renderComponent = () => {
        switch(_style){
        case "style1": 
            return <div className={`${props.className}`}>
                {tokenState.finishLoadWithoutConnected ? (
                    <>
                        <div className="gap-1">
                            <span className="text-3xl font-bold">
                                {" "}
                                {tokenState.token0Price}{" "}
                            </span>
                            <div className="flex gap-2"> 
                                <span className="text-lg">
                                    {" "}
                                    {tokenState.token0Symbol}/{tokenState.token1Symbol}{" "}
                                </span>
                                {_renderTrend()}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Skeleton className="h-16 w-48 rounded" />
                    </>
                )}
            </div>
        case "style2":
            return <div className={`${props.className}`}>
                { tokenState.finishLoadWithoutConnected ? (
                    <div className="flex gap-2">
                        <span>1 {tokenState.token0Symbol} = {tokenState.token0Price} {tokenState.token1Symbol} </span>
                        {_renderTrend()}
                    </div>
                ) : (
                    <>
                        <Skeleton className="h-6 w-60 rounded" />
                    </>
                )}
            </div>
        }
    }

    return _renderComponent()
}

export default TokenPriceRatioDisplay
