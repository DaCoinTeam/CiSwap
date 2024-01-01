export * from "./modules"

import { ChainId } from "@config"
import { Address, Bytes } from "web3"
import { Path, Quote, Step } from "./modules"
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
    encodePacked: (steps: Step[], exactInput?: boolean): Bytes => {
        const path = new Path(steps)
        return exactInput ? path.encodePacked() : path.reverse().encodePacked()
    },
}
