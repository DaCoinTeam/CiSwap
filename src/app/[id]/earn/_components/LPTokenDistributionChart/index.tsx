"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import React from "react"
import Chart from "./Chart"
import { PeriodTabs, TokenPairDisplay, TokenPriceRatioDisplay } from "@app/_shared"
import { useSelector } from "react-redux"
import { RootState } from "@redux"

interface LPTokenDistributionChartProps {
    className?: string;
  }
  
const LPTokenDistributionChart = (props: LPTokenDistributionChartProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <div className="flex justify-between">
                    <div>
                        <TokenPairDisplay token0Price={12} token0Symbol="AAS" token1Symbol="BDD"/>
                        <Spacer y={2}/>
                        <TokenPriceRatioDisplay token0Price={12} token0Symbol="23" token1Symbol="213" />
                    </div>
                    <PeriodTabs darkMode={darkMode} />
                </div>
                <Spacer y={4}/>
                <Chart className="w-full min-h-[300px] max-h-[400px]"/>
            </CardBody>
        </Card>
    )
}

export default LPTokenDistributionChart