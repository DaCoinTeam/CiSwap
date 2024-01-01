export * from "./smart-router"
export * from "./chart"

import { chartService } from "./chart"
import { smartRouterService } from "./smart-router"

export const nextServices = {
    smartRouter: smartRouterService,
    chart: chartService
}
