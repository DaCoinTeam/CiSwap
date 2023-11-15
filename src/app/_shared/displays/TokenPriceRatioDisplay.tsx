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
            <span className="text-teal-500 flex gap-1 items-center">
                <ArrowUpIcon className="h-4 w-4"/>
                <span> {calculateRound(Math.abs(_percentage) * 100, 3)} {" "} % </span>
            </span>   
            :  
            <span className="text-red-500 flex items-center flex">
                <ArrowDownIcon className="h-4 w-4"/>
                <span> {calculateRound(Math.abs(_percentage) * 100, 3)} {" "} % </span>
            </span>
    }

    const _renderComponent = () => {
        switch(_style){
        case "style1": 
            return <div className={`${props.className}`}>
                {tokenState.finishLoadWithoutConnected ? (
                    <>
                        <div className="gap-2 flex items-end">
                            <div className="gap-1 flex items-end">
                                <span className="text-3xl font-bold">
                                    {" "}
                                    {tokenState.token0Price}{" "}
                                </span>
                                <span>
                                    {" "}
                                    {tokenState.token0Symbol}/{tokenState.token1Symbol}{" "}
                                </span> 
                            </div>   
                            <div>
                                {_renderTrend()}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Skeleton className="h-9 w-48 rounded" />
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
