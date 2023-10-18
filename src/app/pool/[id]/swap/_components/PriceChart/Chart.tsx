"use client"
import React, { useContext, useEffect, useRef, useState } from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { BaselineData, IChartApi, ISeriesApi, Time } from "lightweight-charts"
import {
    calculateRedenomination,
    createBaselineChartAndSeries,
    updateBaselineChartWithOptions,
} from "@utils"
import { LiquidityPoolContract } from "@blockchain"
import { PoolAddressContext, TokenStateContext } from "@app/pool/[id]/layout"
import { PeriodContext } from "."

interface PriceTick {
  value: number;
  time: number;
}

const Chart = () => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const poolAddress = useContext(PoolAddressContext)

    const periodContext = useContext(PeriodContext)
    if (periodContext == null) return
    const { period } = periodContext

    if (tokenState == null) return

    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const chainName = useSelector(
        (state: RootState) => state.blockchain.chainName
    )

    const chartContainerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<ISeriesApi<"Baseline"> | null>(null)

    const [priceTicks, setPriceTicks] = useState<PriceTick[]>([])

    useEffect(() => {
        if (!tokenState.finishLoadWithoutConnected) return

        const handleEffect = async () => {
            const contract = new LiquidityPoolContract(chainName, poolAddress)

            const _baseTicks = await contract.getAllBaseTicks()
            if (_baseTicks == null) return

            const _priceTicks: PriceTick[] = _baseTicks.map((tick) => {
                return {
                    value: calculateRedenomination(
                        tick.token0Price,
                        tokenState.token0Decimals,
                        3
                    ),
                    time: tick.timestamp * 1000,
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

        const series = seriesRef.current
        if (series == null) return
        
        series.setData(priceTicks as BaselineData<Time>[])
        
    }, [priceTicks, period, tokenState.finishLoadWithoutConnected])

    return <div ref={chartContainerRef} />
}

export default Chart
