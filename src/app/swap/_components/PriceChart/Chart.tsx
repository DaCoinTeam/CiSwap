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
import { FormikContext } from "../SwapSection/FormikProviders"

interface PriceTick {
  value: number;
  time: number;
}

const Chart = () => {
    const swapContrext = useContext(SwapContext)!
    if (swapContrext === null) return

    const { swapState } = swapContrext
    const { infoIn, infoOut, state } = swapState

    const periodContext = useContext(PeriodContext)
    if (periodContext === null) return
    const { period } = periodContext

    const formik = useContext(FormikContext)! 
    if (formik === null) return

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
    }, [])

    // useEffect(() => {
    //     if (!tokenState.finishLoadWithoutConnected) return

    //     const container = chartContainerRef.current

    //     const clientWidth = container.clientWidth
    //     const chartAndSeries = createBaselineChartAndSeries(
    //         container,
    //         tokenState.token0BasePrice
    //     )

    //     const chart = chartAndSeries.chart
    //     chartRef.current = chart
    //     const series = chartAndSeries.series
    //     seriesRef.current = series

    //     const handleResize = () => {
    //         chart.applyOptions({ width: clientWidth })
    //     }

    //     window.addEventListener("resize", handleResize)

    //     return () => {
    //         window.removeEventListener("resize", handleResize)
    //         chart.remove()
    //     }
    // }, [tokenState.finishLoadWithoutConnected])

    // useEffect(() => {
    //     if (!tokenState.finishLoadWithoutConnected) return

    //     const chart = chartRef.current
    //     if (chart === null) return

    //     const container = chartContainerRef.current
    //     if (container === null) return

    //     updateBaselineChartWithOptions(chart, container, darkMode)
    // }, [darkMode, tokenState.finishLoadWithoutConnected])

    // useEffect(() => {
    //     if (!tokenState.finishLoadWithoutConnected) return

    //     const now = new Date()
    //     let _priceTicks: BaselineData<Time>[]
    //     switch (period) {
    //     case ChartTimePeriod._24H:
    //         now.setDate(now.getDate() - 1)
    //         _priceTicks = priceTicks.filter(
    //             (tick) => tick.time > now.getTime() / 1000
    //         ) as BaselineData<Time>[]
    //         break
    //     case ChartTimePeriod._1W:
    //         now.setDate(now.getDate() - 7)
    //         _priceTicks = priceTicks.filter(
    //             (tick) => tick.time > now.getTime() / 1000
    //         ) as BaselineData<Time>[]
    //         break
    //     case ChartTimePeriod._1M:
    //         now.setMonth(now.getMonth() - 1)
    //         _priceTicks = priceTicks.filter(
    //             (tick) => tick.time > now.getTime() / 1000
    //         ) as BaselineData<Time>[]
    //         break
    //     case ChartTimePeriod._1Y:
    //         now.setFullYear(now.getFullYear() - 1)
    //         _priceTicks = priceTicks.filter(
    //             (tick) => tick.time > now.getTime() / 1000
    //         ) as BaselineData<Time>[]
    //         break
    //     }

    //     const series = seriesRef.current
    //     if (series === null) return

    //     series.setData(_priceTicks)
    // }, [priceTicks, period, tokenState.finishLoadWithoutConnected])

    return <div ref={chartContainerRef} />
}

export default Chart
