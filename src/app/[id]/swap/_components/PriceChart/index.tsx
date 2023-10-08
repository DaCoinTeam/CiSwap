"use client"
import React from "react"

import {
    Card,
    CardBody
} from "@nextui-org/react"

import Chart from "./Chart"

interface PriceChartProps{
    className?: string
}


const PriceChart = (props: PriceChartProps) => {
    return (
        <Card className={`${props.className}`}>
            <CardBody>
                <Chart />
            </CardBody>
        </Card>
    )
}

export default PriceChart
