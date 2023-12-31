import axios from "axios"
import { ChainId } from "@config"
import { Address, Bytes } from "web3"

const ROUTER_URL = "/services/smart-router"

export const smartRouterService = {
    get: async (
        chainId: ChainId,
        amount: bigint,
        tokenIn: Address,
        tokenOut: Address,
        exactInput: boolean
    ): Promise<BestRouteResult | null> => {
        try {
            const params = new URLSearchParams()
            params.set("chainId", chainId.toString())
            params.set("amount", amount.toString())
            params.set("tokenIn", tokenIn)
            params.set("tokenOut", tokenOut)
            params.set("exactInput", exactInput.toString())
            return await axios.get(`${ROUTER_URL}?${params.toString()}`) as BestRouteResult
        } catch (ex) {
            console.log(ex)
            return null
        }
    },
}

export default smartRouterService

export type Step = Address | number;

export interface BestRouteResult {
  amount: bigint;
  path: Step[];
  bytes: Bytes;
}
