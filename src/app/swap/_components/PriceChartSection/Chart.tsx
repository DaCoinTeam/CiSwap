"use client"
import React, {
    MutableRefObject,
    useContext,
    useEffect,
    useRef,
} from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import { PeriodContext } from "./index"
import { PriceChart, services } from "@services"
import { FormikContext } from "../FormikProviders"
import { MouseEventParams, Time } from "lightweight-charts"

const Chart = () => {

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

    const onCrosshairMove = (params: MouseEventParams<Time>) => {
        console.log(params)
    }

    useEffect(() => {
        const priceChart = services.next.chart.createPriceChart(
            chainId,
            chartContainerRef.current,
            darkMode,
            period,
            onCrosshairMove
        )
        priceChartRef.current = priceChart
    }, [])

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

            await priceChart.updatePath(period)
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

    return <div ref={chartContainerRef} />
}

export default Chart
