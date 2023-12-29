"use client"
import React, { MutableRefObject, useContext, useEffect, useRef, useState } from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { BaselineData, IChartApi, ISeriesApi, Time } from "lightweight-charts"
import {
    ChartTimePeriod,
    computeRedenomination,
    createBaselineChartAndSeries,
    timeToLocal,
    updateBaselineChartWithOptions,
} from "@utils"
import { PoolContract } from "@blockchain"
import { PoolContext } from "../../../_hooks"
import { PeriodContext } from "."

interface PriceTick {
  value: number;
  time: number;
}

const Chart = () => {
    const poolContext = useContext(PoolContext)
    if (poolContext == null) return
    const { tokenState, poolAddress } = poolContext 

    const periodContext = useContext(PeriodContext)
    if (periodContext == null) return
    const { period } = periodContext

    if (tokenState == null) return

    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const chainId = useSelector(
        (state: RootState) => state.blockchain.chainId
    )

    const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<"Baseline"> | null>(null)
        
    const [priceTicks, setPriceTicks] = useState<PriceTick[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return

        const handleEffect = async () => {
            const contract = new PoolContract(chainId, poolAddress)

            const _baseTicks = await contract.getAllBaseTicks()
            if (_baseTicks == null) return

            const _priceTicks: PriceTick[] = _baseTicks.map((tick) => {
                return {
                    value: computeRedenomination(
                        tick.token0Price,
                        tokenState.token0Decimals,
                        3
                    ),
                    time: timeToLocal(tick.timestamp),
                }
            })

            setPriceTicks(_priceTicks)
        }
        handleEffect()
    }, [tokenState.finishLoadWithoutConnected])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return

        const container = chartContainerRef.current

        const clientWidth = container.clientWidth
        const chartAndSeries = createBaselineChartAndSeries(
            container,
            tokenState.token0BasePrice
        )

        const chart = chartAndSeries.chart
        chartRef.current = chart
        const series = chartAndSeries.series
        seriesRef.current = series

        const handleResize = () => {
            chart.applyOptions({ width: clientWidth })
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            chart.remove()
        }
    }, [tokenState.finishLoadWithoutConnected])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return

        const chart = chartRef.current
        if (chart == null) return

        const container = chartContainerRef.current
        if (container == null) return

        updateBaselineChartWithOptions(chart, container, darkMode)
    }, [darkMode, tokenState.finishLoadWithoutConnected])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return

        const now = new Date()
        let _priceTicks: BaselineData<Time>[]
        switch (period) {
        case ChartTimePeriod._24H:
            now.setDate(now.getDate() - 1)
            _priceTicks = priceTicks.filter(
                (tick) => tick.time > now.getTime() / 1000
            ) as BaselineData<Time>[]
            break
        case ChartTimePeriod._1W:
            now.setDate(now.getDate() - 7)
            _priceTicks = priceTicks.filter(
                (tick) => tick.time > now.getTime() / 1000
            ) as BaselineData<Time>[]
            break
        case ChartTimePeriod._1M:
            now.setMonth(now.getMonth() - 1)
            _priceTicks = priceTicks.filter(
                (tick) => tick.time > now.getTime() / 1000
            ) as BaselineData<Time>[]
            break
        case ChartTimePeriod._1Y:
            now.setFullYear(now.getFullYear() - 1)
            _priceTicks = priceTicks.filter(
                (tick) => tick.time > now.getTime() / 1000
            ) as BaselineData<Time>[]
            break
        }

        const series = seriesRef.current
        if (series == null) return

        series.setData(_priceTicks)
    }, [priceTicks, period, tokenState.finishLoadWithoutConnected])

    return <div ref={chartContainerRef} />
}

export default Chart
