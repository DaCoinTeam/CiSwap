import { PoolContext } from "../../../_hooks"
import { Skeleton } from "@nextui-org/react"
import React, { useContext } from "react"
import {
    computeInverse,
    computeRedenomination,
    computeRound,
} from "@utils"

interface TokenPriceRatioDisplayProps {
  className?: string;
  token0ImageUrl?: string;
  token1ImageUrl?: string;
  style?: "style1" | "style2";
}

const TokenPriceRatioDisplay = (props: TokenPriceRatioDisplayProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext == null) return
    const { tokenState, isToken0PriceState } = poolContext
    const { isToken0Price } = isToken0PriceState

    let _style = props.style
    if (_style == undefined) _style = "style1"

    const price = computeRedenomination(tokenState.kLast, 5, 3)
    const _currentTokenPrice = isToken0Price
        ? price
        : computeRound(1 / price, 3)
    const _firstTokenSymbol = isToken0Price
        ? tokenState.token0Symbol
        : tokenState.token1Symbol
    const _basePrice = isToken0Price ? price : computeInverse(price, 3)
    const _secondTokenSymbol = isToken0Price
        ? tokenState.token1Symbol
        : tokenState.token0Symbol

    const _renderTrend = () => {
        const _percentage = _currentTokenPrice / _basePrice - 1

        const _up = _percentage >= 0 ? true : false

        return _up ? (
            <span className="text-teal-500">
        (+{computeRound(Math.abs(_percentage) * 100, 3)}%)
            </span>
        ) : (
            <span className="text-red-500">
        (-{computeRound(Math.abs(_percentage) * 100, 3)}%)
            </span>
        )
    }

    const _renderComponent = () => {
        switch (_style) {
        case "style1":
            return (
                <div className={`${props.className}`}>
                    {tokenState.finishLoadWithoutConnected ? (
                        <>
                            <div className="gap-2 flex items-end">
                                <div className="gap-1 flex items-end">
                                    <span className="text-3xl font-bold">
                                        {" "}
                                        {_currentTokenPrice}{" "}
                                    </span>
                                    <span>
                                        {" "}
                                        {_firstTokenSymbol}/{_secondTokenSymbol}{" "}
                                    </span>
                                </div>
                                <div>{_renderTrend()}</div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton className="h-9 w-48 rounded" />
                        </>
                    )}
                </div>
            )
        case "style2":
            return (
                <div className={`${props.className}`}>
                    {tokenState.finishLoadWithoutConnected ? (
                        <div className="flex gap-2">
                            <span>
                  1 {_firstTokenSymbol} = {_currentTokenPrice}{" "}
                                {_secondTokenSymbol}{" "}
                            </span>
                            {_renderTrend()}
                        </div>
                    ) : (
                        <>
                            <Skeleton className="h-6 w-60 rounded" />
                        </>
                    )}
                </div>
            )
        }
    }

    return _renderComponent()
}

export default TokenPriceRatioDisplay
