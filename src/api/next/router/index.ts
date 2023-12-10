import axios from "axios"
import { ChainId } from "@config"
import { Address } from "web3"

const ROUTER_URL = "/services/router"
export const routerGET = async (
    chainId: ChainId,
    tokenInAddress: Address,
    tokenOutAddress: Address
) => {
    const params = new URLSearchParams()
    params.set("chainId", chainId.toString())
    params.set("tokenInAddress", tokenInAddress)
    params.set("tokenOutAddress", tokenOutAddress)
    return axios.get(`${ROUTER_URL}?${params.toString()}`)
}
