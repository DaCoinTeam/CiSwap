"use client"
import React, { MutableRefObject, useContext, useEffect, useRef } from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PriceChartContext } from "../index"
import { PriceChart, services } from "@services"
import { FormikContext } from "../../../_hooks"
import { BaselineData, MouseEventParams, Time } from "lightweight-charts"
import { CircularProgress } from "@nextui-org/react"
import { TicksBoundary } from "@services"

const Chart = () => {
    const { period, tickAtCrosshair, tickAtFirst } =
    useContext(PriceChartContext)!

    const formik = useContext(FormikContext)!

    const darkMode = useSelector(
        (state: RootState) => state.configuration.darkMode
    )

    const chainId = useSelector((state: RootState) => state.blockchain.chainId)

    const chartContainerRef =
    useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>

    const priceChartRef = useRef<PriceChart | null>(null)

    const onCrosshairMove = (params: MouseEventParams<Time>) => {
        const priceChart = priceChartRef.current
        if (priceChart == null) return

        const { series } = priceChart
        if (!series) return
        const data = params.seriesData.get(series) as BaselineData<Time>

        if (!data) return
        tickAtCrosshair.set(data)
    }

    const updateTicksBoundary = (ticksBoundary: TicksBoundary | null) => {
        if (!ticksBoundary) return
        const { first, last } = ticksBoundary

        tickAtFirst.set(first)
        tickAtCrosshair.set(last)
    }

    useEffect(() => {
        if (!formik.values.steps.length) return
        const priceChartStored = priceChartRef.current
        const existed = priceChartStored !== null

        let priceChart: PriceChart
      
        const path = services.next.smartRouter.encodePacked(
            formik.values.steps
        )

        if (existed) {
            priceChart = priceChartStored
        } else {
            priceChart = services.next.chart.createPriceChart(
                chainId,
                chartContainerRef.current,
                darkMode,
                period.value,
                onCrosshairMove
            )
            priceChartRef.current = priceChart
            priceChart.applyOptionsToChart()
        }

        window.addEventListener("resize", () => {
            priceChart.applyOptionsToChart()
        })

        const handleEffect = async () => {
            const ticksBoundary = await priceChart.updatePath(path)
            if (!ticksBoundary) return null
            updateTicksBoundary(ticksBoundary)

            priceChart.applyOptionsToSeries(ticksBoundary.first.value)
        }

        handleEffect()

        return () => {
            window.removeEventListener("resize", () => {
                priceChart.applyOptionsToChart()
            })
        }
    }, [formik.values.steps])

    // const periodHasMountedRef = useRef(false)
    // useEffect(() => {
    //     if (!formik.values.steps.length) return
    //     const handleEffect = async () => {
    //         if (!periodHasMountedRef.current) {
    //             periodHasMountedRef.current = true
    //             return
    //         }
    //         const priceChart = priceChartRef.current
    //         if (priceChart === null) return

    //         const ticksBoundary = await priceChart.updatePeriod(period.value)
    //         updateTicksBoundary(ticksBoundary)
    //     }
    //     handleEffect()
    // }, [period])

    const darkModeHasMountedRef = useRef(false)
    useEffect(() => {
        if (!darkModeHasMountedRef.current) {
            darkModeHasMountedRef.current = true
            return
        }
        const priceChart = priceChartRef.current
        if (!priceChart) return

        priceChart.updateDarkMode(darkMode)
    }, [darkMode])

    return (
        <>
            {formik.values.steps.length ? (
                <div className="w-full aspect-video" ref={chartContainerRef} />
            ) : (
                <div className="w-full aspect-video grid place-content-center">
                    <CircularProgress
                        classNames={{
                            indicator: "text-teal-500",
                        }}
                        label="Loading..."
                    />
                </div>
            )}
        </>
    )
}

export default Chart
