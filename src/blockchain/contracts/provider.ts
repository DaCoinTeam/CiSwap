import Web3, { HttpProvider, WebSocketProvider } from "web3"
import { ChainName, chainInfos } from "../config"

export const getHttpWeb3 = (
    chainName: ChainName, 
    abortController?: AbortController
) : Web3 => {
    const providerOptions = abortController
        ? {
            providerOptions: {
                signal: abortController.signal
            }
        } : undefined
    
    const provider = new HttpProvider(chainInfos[chainName].httpRpcUrl, providerOptions)
    return new Web3(provider)
}

export const getWebsocketWeb3 = (chainName: ChainName) : Web3 => {
    const provider = new WebSocketProvider((chainInfos[chainName].websocketRpcUrl))
    return new Web3(provider)
}
