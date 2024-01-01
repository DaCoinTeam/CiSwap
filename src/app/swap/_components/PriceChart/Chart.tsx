"use client"
import React, {
    MutableRefObject,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import utils from "@utils"
import { SwapContext } from "../../_hooks"
import { PeriodContext } from "./index"
import { PriceChart, services } from "@services"
import { chainInfos } from "@config"
import { FormikContext } from "../FormikProviders"

const Chart = () => {
    const { swapState } = useContext(SwapContext)!
    const { infoIn, infoOut } = swapState

    const periodContext = useContext(PeriodContext)!
    const { period } = periodContext

    const formik = useContext(FormikContext)!

    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>

    const priceChartRef = useRef<PriceChart | null>(null)

    useEffect(() => {
        const priceChart = services.next.chart.createPriceChart(
            chainId,
            chartContainerRef.current
        )
        priceChartRef.current = priceChart
    }, [])

    useEffect(() => {
        const handleEffect = async () => {
            const priceChart = priceChartRef.current
            if (priceChart === null) return
            
            const path = services.next.smartRouter.encodePacked(
                steps,
                formik.values.exactInput
            )
            await priceChart.updateTicks(period, path)
        }
        handleEffect()
    }, [period])

    return <div ref={chartContainerRef} />
}

export default Chart
