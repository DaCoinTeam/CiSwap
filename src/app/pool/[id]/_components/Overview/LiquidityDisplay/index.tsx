"use client"
import { Skeleton, Spacer, Tooltip } from "@nextui-org/react"
import React, { useContext } from "react"
import { TitleDisplay } from "@app/_shared"
import { PoolContext } from "../../../_hooks"
import { computeRedenomination } from "@utils"
import numeral from "numeral"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline"

interface LiquidityDisplayProps {
  className?: string;
}

const LiquidityDisplay = (props: LiquidityDisplayProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return
    const { tokenState } = poolContext
    const _renderLiquidity = () => {
        const liquidity = tokenState.liquidity
        const redenLiquidity = computeRedenomination(
            liquidity,
            tokenState.token0Decimals + tokenState.token1Decimals,
            0
        )
        return numeral(redenLiquidity).value()
    }

    return (
        <div className={`${props.className}`}>
            <div className="flex gap-2 items-center">
                <TitleDisplay title={"Liquidity"} size="md" />
                <Tooltip showArrow={true} content={"AAAA"} >
                    <QuestionMarkCircleIcon className="text-teal-500" height={16} width={16} />
                </Tooltip>
            </div>
            
            <Spacer y={1} />
            {tokenState.finishLoadWithoutConnected ? (
                <>
                    <div className="font-bold text-4xl">{_renderLiquidity()}</div>
                </>
            ) : (
                <Skeleton className="h-12 w-40 rounded" />
            )}
        </div>
    )
}
export default LiquidityDisplay
