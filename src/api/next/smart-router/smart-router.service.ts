import axios from "axios"
import { ChainId } from "@config"
import { Address } from "web3"
import Quote from "./quote.module"

const ROUTER_URL = "/services/smart-router"

export const smartRouterService = {
    get: async (
        chainId: ChainId,
        amount: bigint,
        tokenIn: Address,
        tokenOut: Address,
        exactInput: boolean
    ): Promise<Quote | null> => {
        try {
            const params = new URLSearchParams()
            params.set("chainId", chainId.toString())
            params.set("amount", amount.toString())
            params.set("tokenIn", tokenIn)
            params.set("tokenOut", tokenOut)
            params.set("exactInput", exactInput.toString())
            return (await axios.get(`${ROUTER_URL}?${params.toString()}`)) as Quote
        } catch (ex) {
            console.log(ex)
            return null
        }
    },
}

