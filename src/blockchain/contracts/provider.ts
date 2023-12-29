import Web3, { HttpProvider, WebSocketProvider } from "web3"
import { ChainId, chainInfos } from "@config"

export const getHttpWeb3 = (
    chainId: ChainId, 
    controller?: AbortController
) : Web3 => {
    const providerOptions = controller
        ? {
            providerOptions: {
                signal: controller.signal
            }
        } : undefined
    
    const provider = new HttpProvider(chainInfos[chainId].httpRpcUrl, providerOptions)
    return new Web3(provider)
}

export const getWebsocketWeb3 = (chainId: ChainId) : Web3 => {
    const provider = new WebSocketProvider((chainInfos[chainId].websocketRpcUrl))
    return new Web3(provider)
}
