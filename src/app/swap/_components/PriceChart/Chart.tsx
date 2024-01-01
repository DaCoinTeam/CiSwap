"use client"
import React, {
    MutableRefObject,
    useContext,
    useEffect,
    useRef,
} from "react"

import { RootState } from "@redux"
import { useSelector } from "react-redux"
import utils from "@utils"
import { SwapContext } from "../../_hooks"
import { PeriodContext } from "./index"
import { PriceChart, services } from "@services"
import { chainInfos } from "@config"
import { FormikContext } from "../FormikProviders"
import { MouseEventParams, Time } from "lightweight-charts"

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

    const stepsHasMounted = useRef(false)
    useEffect(() => {
        if (!stepsHasMounted.current) {
            stepsHasMounted.current = true
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

    const periodHasMounted = useRef(false)
    useEffect(() => {
        const handleEffect = async () => {
            if (!periodHasMounted.current) {
                periodHasMounted.current = true
                return
            }
            const priceChart = priceChartRef.current
            if (priceChart === null) return

            await priceChart.updatePath(period)
        }
        handleEffect()
    }, [period])

    const darkModeHasMounted = useRef(false)
    useEffect(() => {
        if (!darkModeHasMounted.current) {
            darkModeHasMounted.current = true
            return
        }
        const priceChart = priceChartRef.current
        if (priceChart === null) return

        priceChart.updateDarkMode(darkMode)
    }, [darkMode])

    return <div ref={chartContainerRef} />
}

export default Chart
