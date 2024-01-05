export * from "./modules"

import { ChainId } from "@config"
import { Period, PriceChart } from "./modules"
import { MouseEventHandler, Time } from "lightweight-charts"
import { Bytes } from "web3"

export const chartService = {
    createPriceChart: async (
        chainId: ChainId,
        container: HTMLDivElement,
        darkMode: boolean,
        period: Period,
        path: Bytes,
        onCrosshairMove?: MouseEventHandler<Time>
    ) => {
        const priceChart = new PriceChart(
            chainId,
            container,
            darkMode,
            period,
            path,
            onCrosshairMove
        )
        await priceChart.updateSeries()
        return priceChart
    },
}
