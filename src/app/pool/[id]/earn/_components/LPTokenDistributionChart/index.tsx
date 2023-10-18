"use client"
import { Card, CardBody, Spacer } from "@nextui-org/react"
import React, { useState } from "react"
import Chart from "./Chart"
import { PeriodTabs } from "@app/_shared"
import { ChartTimePeriod } from "@utils"

interface LPTokenDistributionChartProps {
    className?: string;
  }
  
const LPTokenDistributionChart = (props: LPTokenDistributionChartProps) => {
    
    const [period, setPeriod] = useState(ChartTimePeriod._24H)
    
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <div className="flex justify-between">
                    <div>
                    </div>
                    <PeriodTabs tab = {period} setTab = {setPeriod}/>
                </div>
                <Spacer y={4}/>
                <Chart className="w-full min-h-[300px]"/>
            </CardBody>
        </Card>
    )
}

export default LPTokenDistributionChart