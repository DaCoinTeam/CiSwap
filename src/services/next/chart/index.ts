export * from "./modules"

import { ChainId } from "@config"
import { Period, PriceChart } from "./modules"
import { MouseEventHandler, Time } from "lightweight-charts"

export const chartService = {
    createPriceChart: (
        chainId: ChainId,
        container: HTMLDivElement,
        darkMode: boolean,
        period: Period,
        onCrosshairMove?: MouseEventHandler<Time>
    ) : PriceChart => {
        const priceChart = new PriceChart(
            chainId,
            container,
            darkMode,
            period,
            onCrosshairMove
        )
        return priceChart
    },
}
