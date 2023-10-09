"use client"
import React from "react"

import { Card, CardBody, Spacer } from "@nextui-org/react"

import Chart from "./Chart"
import { PeriodTabs, TokenPairDisplay, TokenPriceRatioDisplay } from "@app/_shared"
import { RootState } from "@redux"
import { useSelector } from "react-redux"

interface PriceChartProps {
  className?: string;
}

const PriceChart = (props: PriceChartProps) => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <div className="flex justify-between">
                    <div>
                        <TokenPairDisplay token0Price={12} token0Symbol="USDT" token1Symbol="GRR"/>
                        <Spacer y={2}/>
                
                        <TokenPriceRatioDisplay
                            token0Price={4}
                            token0Symbol="STARCI"
                            token1Symbol="USDT"
                        />
                    </div>
                    <PeriodTabs darkMode = {darkMode}/>
                </div>
                

                <Spacer y={6}/>
                <Chart />
            </CardBody>
        </Card>
    )
}

export default PriceChart
