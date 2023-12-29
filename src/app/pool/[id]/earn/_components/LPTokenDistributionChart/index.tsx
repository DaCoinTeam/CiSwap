"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import React, { useContext, useState } from "react"
import Chart from "./Chart"
import { PeriodTabs, TokenTooltipDisplay } from "@app/_shared"
import { ChartTimePeriod, computeRound } from "@utils"
import { PoolContext } from "../../../_hooks"

interface LPTokenDistributionChartProps {
    className?: string;
  }
  
const LPTokenDistributionChart = (props: LPTokenDistributionChartProps) => {
    const poolContext = useContext(PoolContext)
    if (poolContext == null) return 
    const { tokenState } = poolContext 

    const [period, setPeriod] = useState(ChartTimePeriod._24H)
    
    return (
        <Card className={`${props.className}`}>
            <CardBody className="p-5">
                <div className="flex justify-between">
                    <TokenTooltipDisplay
                        tooltipContent="Total LP Token Distributed" 
                        value={computeRound(tokenState.LPTokenTotalSupply - tokenState.LPTokenAmountLocked, 3)}
                        prefix={tokenState.LPTokenSymbol}
                        finishLoad={tokenState.finishLoadWithoutConnected}
                    />
                    <PeriodTabs tab = {period} setTab = {setPeriod}/>
                </div>
                <Spacer y={4}/>
                <Chart className="w-full min-h-[300px]"/>
            </CardBody>
        </Card>
    )
}

export default LPTokenDistributionChart