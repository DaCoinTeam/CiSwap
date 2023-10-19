"use client"
import React, { createContext, useContext, useState } from "react"

import { Card, CardBody, Spacer } from "@nextui-org/react"

import Chart from "./Chart"
import {
    PeriodTabs,
    TokenPairDisplay,
    TokenPriceRatioDisplay,
} from "@app/_shared"
import { TokenStateContext } from "@app/pool/[id]/layout"
import { ChartTimePeriod } from "@utils"

interface PriceChartProps {
  className?: string;
}

interface PeriodContext {
  period: ChartTimePeriod;
  setPeriod: React.Dispatch<React.SetStateAction<ChartTimePeriod>>;
}

export const PeriodContext = createContext<PeriodContext | null>(null)

const PriceChart = (props: PriceChartProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const [period, setPeriod] = useState(ChartTimePeriod._24H)

    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <PeriodContext.Provider value={{ period, setPeriod }}>
                    <div className="grid md:flex justify-between gap-4">
                        <div>
                            <TokenPairDisplay />
                            <Spacer y={1} />
                            <TokenPriceRatioDisplay />
                        </div>
                        <PeriodTabs tab = {period} setTab = {setPeriod}/>
                    </div>

                    <Spacer y={6} />
                    <Chart />
                </PeriodContext.Provider>
            </CardBody>
        </Card>
    )
}

export default PriceChart
