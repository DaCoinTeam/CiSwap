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
        try {
            const smartRouter = new SmartRouter(chainId)
            return smartRouter.findBestQuote(amount, tokenIn, tokenOut, exactInput)
        } catch (ex) {
            console.log(ex)
            return null
        }
    },

    encodePacked: (steps: Step[], exactInput?: boolean): Bytes => {
        const path = new Path(steps)
        return exactInput ? path.encodePacked() : path.reverse().encodePacked()
    },

    getSwapScenario: (
        slippage: number,
        recipient: Address,
        txDeadline: number,
        amountInRaw: bigint,
        amountOutRaw: bigint,
        steps: Step[],
        exactInput?: boolean
    ) => {
        const path = new Path(steps)
        const quote = new Quote(amountInRaw, amountOutRaw, path, exactInput)
        return quote.getSwapScenario(slippage, recipient, txDeadline)
    },
}
