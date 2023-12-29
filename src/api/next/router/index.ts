import axios from "axios"
import { ChainId } from "@config"
import { Address } from "web3"

const ROUTER_URL = "/services/router"
export const routerGET = async (
    chainId: ChainId,
    tokenIn: Address,
    tokenOut: Address
) => {
    const params = new URLSearchParams()
    params.set("chainId", chainId.toString())
    params.set("tokenIn", tokenIn)
    params.set("tokenOut", tokenOut)
    return axios.get(`${ROUTER_URL}?${params.toString()}`)
}
