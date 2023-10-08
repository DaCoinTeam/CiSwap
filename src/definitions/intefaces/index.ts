import { Address } from "web3"

export interface ChainInfo {
    httpRpcUrl: string
    websocketRpcUrl: string
    factoryContractAddress: Address
    stableCoinAddresses: Address[]
    explorerUrl: string
}