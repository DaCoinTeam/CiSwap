"use client"
import React, { MutableRefObject, useContext, useEffect, useRef } from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PriceChartContext } from "./index"
import { PriceChart, services } from "@services"
import { FormikContext } from "../FormikProviders"
import { LineData, MouseEventParams, Time } from "lightweight-charts"
import { SwapContext } from "@app/swap/_hooks"
import { CircularProgress } from "@nextui-org/react"

const Chart = () => {
    const { period, tickAtCrosshair } = useContext(PriceChartContext)!

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
        const data = params.seriesData.get(series) as LineData<Time>
        if (!data) return
        const {time, value } = data 

        tickAtCrosshair.set({
            price: value,
            time: time
        })
    }

    useEffect(() => {
        if (!swapState.status.finishLoadBeforeConnectWallet) return

        const priceChart = services.next.chart.createPriceChart(
            chainId,
            chartContainerRef.current,
            darkMode,
            period.value,
            onCrosshairMove
        )
        priceChartRef.current = priceChart

        window.addEventListener("resize", () => {
            priceChart.applyOptions()
        })

        return () => {
            window.removeEventListener("resize", () => {
                priceChart.applyOptions()
            })
        }
    }, [swapState.status.finishLoadBeforeConnectWallet])

    const stepsHasMountedRef = useRef(false)
    useEffect(() => {
        if (!stepsHasMountedRef.current) {
            stepsHasMountedRef.current = true
            return
        }

        const updatePriceChartPath = async () => {
            const priceChart = priceChartRef.current
            if (priceChart === null) return

            const encodedPath = services.next.smartRouter.encodePacked(
                formik.values.steps,
                true
            )
            await priceChart.updatePath(encodedPath)
        }
        updatePriceChartPath()
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

            await priceChart.updatePath(period.value)
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
                    <CircularProgress classNames={
                        {
                            indicator: "text-teal-500",
                        }
                    } label="Loading..." />
                </div>
            )}
        </>
    )
}

export default Chart
