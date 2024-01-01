export * from "./modules"

import { ChainId } from "@config"
import { PriceChart } from "./modules"

export const chartService = {
    createPriceChart: (
        chainId: ChainId,
        container: HTMLDivElement
    ) => {
        return new PriceChart(chainId, container)
    }
}


