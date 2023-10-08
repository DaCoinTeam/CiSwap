"use client"
import React from "react"

import { Card, CardBody, Spacer } from "@nextui-org/react"

import Chart from "./Chart"
import { TokenPairDisplay, TokenPriceRatioDisplay } from "@app/_shared"

interface PriceChartProps {
  className?: string;
}

const PriceChart = (props: PriceChartProps) => {
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <TokenPairDisplay token0Price={12} token0Symbol="USDT" token1Symbol="GRR"/>
                <Spacer y={2}/>
                <TokenPriceRatioDisplay
                    token0Price={4}
                    token0Symbol="STARCI"
                    token1Symbol="USDT"
                />

                <Spacer y={6}/>
                <Chart />
            </CardBody>
        </Card>
    )
}

export default PriceChart
