import Web3, { Address } from "web3"

const KLAYTN_MAINNET_HTTP_RPC_URL = "..."
const KLAYTN_MAINNET_WEBSOCKET_RPC_URL = "..."
const KLAYTN_MAINNET_CONTRACT_FACTORY = "..."
const KLAYTN_MAINNET_USDT_CONTRACT = "..."
const KLAYTN_MAINNET_EXPLORER = ""

const KLAYTN_TESTNET_HTTP_RPC_URL = "https://api.baobab.klaytn.net:8651"
const KLAYTN_TESTNET_WEBSOCKET_RPC_URL = "wss://public-en-baobab.klaytn.net/ws"
const KLAYTN_TESTNET_CONTRACT_FACTORY = "0x5550df0b9E5ba8fA0f6d56A69243D8baC949ffBD"
const KLAYTN_TESTNET_USDT_CONTRACT = "0xEdEb5f63537EbAe7E6dD79D95Cd2EF20C75Cd732"
const KLAYTN_TESTNET_EXPLORER = "https://baobab.klaytnscope.com/"

export const TIME_OUT = 1000

export enum ChainName {
    KlaytnMainnet,
    KalytnTestnet,
    PolygonMainnet,
    PolygonTestnet
}

export type ChainInfo = {
    httpRpcUrl: string
    websocketRpcUrl: string
    factoryAddress: Address
    stableCoinAddresses: Address[]
    explorerUrl: string
}

export const chainInfos : Record<number, ChainInfo> = {
    [ChainName.KlaytnMainnet]: {
        httpRpcUrl: KLAYTN_MAINNET_HTTP_RPC_URL,
        websocketRpcUrl : KLAYTN_MAINNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_MAINNET_CONTRACT_FACTORY,
        stableCoinAddresses: [ KLAYTN_MAINNET_USDT_CONTRACT ],
        explorerUrl: KLAYTN_MAINNET_EXPLORER
    },
    [ChainName.KalytnTestnet]: {
        httpRpcUrl: KLAYTN_TESTNET_HTTP_RPC_URL,
        websocketRpcUrl : KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_TESTNET_CONTRACT_FACTORY,
        stableCoinAddresses: [ KLAYTN_TESTNET_USDT_CONTRACT ],
        explorerUrl: KLAYTN_TESTNET_EXPLORER
    }
}

export const GAS_PRICE = Web3.utils.toWei(25, "gwei")
export const GAS_LIMIT = 3000000