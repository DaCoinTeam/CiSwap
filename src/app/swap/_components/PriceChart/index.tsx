"use client"
import React, { createContext, useState } from "react"

import { Card, CardBody, Spacer } from "@nextui-org/react"

import Chart from "./Chart"
import { PeriodTabs } from "@app/_shared"
import { TokenPairDisplay, TokenPriceRatioDisplay } from "../../_components"
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

    const [period, setPeriod] = useState(ChartTimePeriod._24H)

    return (
        <Card className={`${props.className}`}>
            <CardBody className="p-5">
                <PeriodContext.Provider value={{ period, setPeriod }}>
                    <div className="grid md:flex justify-between gap-4">
                        <div>
                            <TokenPairDisplay/>
                            <Spacer y={1} />
                            <TokenPriceRatioDisplay />
                        </div>
                        <PeriodTabs tab={period} setTab={setPeriod} />
                    </div>

                    <Spacer y={6} />
                    <Chart />
                </PeriodContext.Provider>
            </CardBody>
        </Card>
    )
}

export default PriceChart
