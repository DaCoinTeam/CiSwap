export * from "./modules"

import { ChainId } from "@config"
import { Address } from "web3"
import { Quote } from "./modules"
import { SmartRouter } from "./modules"

export const smartRouterService = {
    findBestQuote: async (
        chainId: ChainId,
        amount: bigint,
        tokenIn: Address,
        tokenOut: Address,
        exactInput: boolean
    ): Promise<Quote | null> => {
        const smartRouter = new SmartRouter(chainId)
        return smartRouter.findBestQuote(amount, tokenIn, tokenOut, exactInput)
    },
}
