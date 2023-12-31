import axios from "axios"
import { ChainId } from "@config"
import { Address } from "web3"

const ROUTER_URL = "/services/smart-router"

export const smartRouterService = {
    get : async (
        chainId: ChainId,
        amount: bigint,
        tokenIn: Address,
        tokenOut: Address,
        exactInput: boolean
    ) => {
        const params = new URLSearchParams()
        params.set("chainId", chainId.toString())
        params.set("amount", amount.toString())
        params.set("tokenIn", tokenIn)
        params.set("tokenOut", tokenOut)
        params.set("exactInput", exactInput.toString())
        return axios.get(`${ROUTER_URL}?${params.toString()}`)
    },
}

export default smartRouterService
