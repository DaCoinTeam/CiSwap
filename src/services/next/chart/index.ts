export * from "./modules"
export * from "./shared"

import { ChainId } from "@config"
import { PriceChart } from "./modules"
import { Period } from "./shared"
import { MouseEventHandler, Time } from "lightweight-charts"

const chart = {
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

export default chart