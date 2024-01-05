"use client"
import React, { MutableRefObject, useContext, useEffect, useRef } from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PriceChartContext } from "../index"
import { PriceChart, services } from "@services"
import { FormikContext, SwapContext } from "../../../_hooks"
import { LineData, MouseEventParams, Time } from "lightweight-charts"
import { CircularProgress } from "@nextui-org/react"
import { TicksBoundary } from "@services"

const Chart = () => {
    const { period, tickAtCrosshair, tickAtFirst } =
    useContext(PriceChartContext)!

    const { swapState } = useContext(SwapContext)!

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
        const data = params.seriesData.get(series) as LineData<Time>

        if (!data) return
        tickAtCrosshair.set(data)
    }

    const updateTicksBoundary = (ticksBoundary: TicksBoundary | null) => {
        if (ticksBoundary === null) return
        const { first, last } = ticksBoundary

        tickAtFirst.set(first)
        tickAtCrosshair.set(last)
    }

    useEffect(() => {
        if (!formik.values.steps.length) return

        let priceChart : PriceChart

        const handleEffect = async () => {
            const path = services.next.smartRouter.encodePacked(
                formik.values.steps,
                true
            )

            let ticksBoundary: TicksBoundary | null

            const priceChartStored = priceChartRef.current 

            if (priceChartStored) {
                priceChart = priceChartStored
                const path = services.next.smartRouter.encodePacked(
                    formik.values.steps,
                    true
                )
                ticksBoundary = await priceChart.updatePath(path)
            } else {
                priceChart = await services.next.chart.createPriceChart(
                    chainId,
                    chartContainerRef.current,
                    darkMode,
                    period.value,
                    path,
                    onCrosshairMove
                )
                
                priceChartRef.current = priceChart
                
                ticksBoundary = await priceChart.setData()
            
            }
            updateTicksBoundary(ticksBoundary)
        }
         
        handleEffect()
        
        window.addEventListener("resize", () => {
            priceChart.applyOptions()
        })
        return () => {
            window.removeEventListener("resize", () => {
                priceChart.applyOptions()
            })
        }
    }, [formik.values.steps])

    const periodHasMountedRef = useRef(false)
    useEffect(() => {
        const handleEffect = async () => {
            if (!periodHasMountedRef.current) {
                periodHasMountedRef.current = true
                return
            }
            const priceChart = priceChartRef.current
            if (priceChart === null) return

            const ticksBoundary = await priceChart.updatePath(period.value)
            updateTicksBoundary(ticksBoundary)
        }
        handleEffect()
    }, [period])

    const darkModeHasMountedRef = useRef(false)
    useEffect(() => {
        if (!darkModeHasMountedRef.current) {
            darkModeHasMountedRef.current = true
            return
        }
        const priceChart = priceChartRef.current
        if (priceChart === null) return

        priceChart.updateDarkMode(darkMode)
    }, [darkMode])

    return (
        <>
            {swapState.status.finishLoadBeforeConnectWallet ? (
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
