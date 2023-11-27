"use client"
import { Card, CardBody } from "@nextui-org/react"
import React, { createContext, useState } from "react"
import Token0Chart from "./Token0Chart"
import { PeriodTabs } from "@app/_shared"
import { ChartTimePeriod } from "@utils"
import ChartTabs, { ChartType } from "./ChartTypeSelect"

interface TokenLockedChartProps {
  className?: string;
}

interface ChartTypeContext {
  chartType: ChartType;
  setChartType: React.Dispatch<React.SetStateAction<ChartType>>;
}

export const ChartTypeContext = createContext<ChartTypeContext | null>(null)

const TokenLockedChart = (props: TokenLockedChartProps) => {

    const [period, setPeriod] = useState(ChartTimePeriod._24H)

    const [chartType, setChartType] = useState(ChartType.Liquidity)

    return (
        <Card className={`${props.className}`}>
            <ChartTypeContext.Provider value={{ chartType, setChartType }}>
                <CardBody className="gap-4 p-5">
                    <div className="flex justify-between items-start">
                        <ChartTabs />
                        <PeriodTabs size="sm" tab={period} setTab={setPeriod} />
                    </div>
                    <Token0Chart className="w-full min-h-[300px]" />
                </CardBody>
            </ChartTypeContext.Provider>
        </Card>
    )
}

export default TokenLockedChart
