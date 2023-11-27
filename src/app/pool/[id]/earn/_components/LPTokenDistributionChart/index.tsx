"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import React, { useContext, useState } from "react"
import Chart from "./Chart"
import { PeriodTabs, TokenTooltipDisplay } from "@app/_shared"
import { ChartTimePeriod, calculateRound } from "@utils"
import { PoolContext } from "../../../layout"

interface LPTokenDistributionChartProps {
    className?: string;
  }
  
const LPTokenDistributionChart = (props: LPTokenDistributionChartProps) => {
    const context = useContext(PoolContext)
    if (context == null) return 
    const { tokenState } = context 

    const [period, setPeriod] = useState(ChartTimePeriod._24H)
    
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <div className="flex justify-between">
                    <TokenTooltipDisplay
                        tooltipContent="Total LP Token Distributed" 
                        value={calculateRound(tokenState.LPTokenTotalSupply - tokenState.LPTokenAmountLocked, 3)}
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