"use client"
import React, { useEffect, useRef } from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { BaselineData, IChartApi, ISeriesApi, Time } from "lightweight-charts"
import { createBaselineChartAndSeries, applyOptionsBaselineChart } from "@utils"

const Chart = () => {
    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const chartContainerRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>
    const chartRef = useRef<IChartApi|null>(null)
    const seriesRef = useRef<ISeriesApi<"Baseline">|null>(null)

    useEffect(() => {
        const container = chartContainerRef.current

        const clientWidth = container.clientWidth
        const chartAndSeries = createBaselineChartAndSeries(container)
        
        const chart = chartAndSeries.chart
        chartRef.current = chart
        const series = chartAndSeries.series
        seriesRef.current = series

        //testing only, remove later
        const data = [{ value: 1, time: 1642425322 }, { value: 8, time: 1642511722 }, { value: 10, time: 1642598122 }, { value: 20, time: 1642684522 }, { value: 3, time: 1642770922 }, { value: 43, time: 1642857322 }, { value: 41, time: 1642943722 }, { value: 43, time: 1643030122 }, { value: 56, time: 1643116522 }, { value: 46, time: 1643202922 }]    
        series.setData(data as BaselineData<Time>[])

        const handleResize = () => {
            chart.applyOptions({ width: clientWidth })
        }
        
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
            chart.remove()
        }
    }, [])

    useEffect(() => {
        const chart = chartRef.current
        if (chart == null) return

        const container = chartContainerRef.current
        if (container == null) return

        applyOptionsBaselineChart(chart, container, darkMode)
    }, [darkMode])

    return <div ref={chartContainerRef} />
}

export default Chart
