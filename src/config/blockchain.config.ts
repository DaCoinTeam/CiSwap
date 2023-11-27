import Web3, { Address } from "web3"

const KLAYTN_MAINNET_HTTP_RPC_URL = "..."
const KLAYTN_MAINNET_WEBSOCKET_RPC_URL = "..."
const KLAYTN_MAINNET_CONTRACT_FACTORY = "..."

const KLAYTN_MAINNET_CONTRACT_NFT =
"..." 

const KLAYTN_MAINNET_EXCHANGE_TOKEN =
  "0xA6e709154cfc6fBee95C8F2E57a5091C26312753"

const KLAYTN_MAINNET_USDT = "..."
const KLAYTN_MAINNET_EXPLORER = ""

const KLAYTN_TESTNET_HTTP_RPC_URL = "https://api.baobab.klaytn.net:8651"
const KLAYTN_TESTNET_WEBSOCKET_RPC_URL = "wss://public-en-baobab.klaytn.net/ws"

const KLAYTN_TESTNET_CONTRACT_FACTORY =
  "0xBE1a73Da3456e9C69D0A8ed17480B21d26CB4E58"

const KLAYTN_TESTNET_CONTRACT_NFT =
  "0xEc55699a4127dd36B5b1b95981da512f857FC9de"


const KLAYTN_TESTNET_EXCHANGE_TOKEN =
  "0xA6e709154cfc6fBee95C8F2E57a5091C26312753"

const KLAYTN_TESTNET_USDT =
  "0xEdEb5f63537EbAe7E6dD79D95Cd2EF20C75Cd732"
const KLAYTN_TESTNET_EXPLORER = "https://baobab.klaytnscope.com/"

export enum ChainId {
  KlaytnMainnet = 8217,
  KalytnTestnet = 1001,
  PolygonMainnet = 137,
  PolygonTestnet = 80001,
  BinanceSmartChainTestnet = 97,
  BinanceSmartChainMainnet = 56
}

export type ChainInfo = {
  httpRpcUrl: string;
  websocketRpcUrl: string;
  factoryAddress: Address;
  NFTAddress: Address;
  exchangeTokenAddress: Address;
  stableTokenAddresses: Address[];
  explorerUrl: string;
};

export const defaultChainId = ChainId.KalytnTestnet

export const chainInfos: Record<number, ChainInfo> = {
    [ChainId.KlaytnMainnet] : {
        httpRpcUrl: KLAYTN_MAINNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_MAINNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_MAINNET_CONTRACT_FACTORY,
        NFTAddress: KLAYTN_MAINNET_CONTRACT_NFT,
        exchangeTokenAddress: KLAYTN_MAINNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_MAINNET_USDT],
        explorerUrl: KLAYTN_MAINNET_EXPLORER,
    },
    [ChainId.KalytnTestnet]: {
        httpRpcUrl: KLAYTN_TESTNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_TESTNET_CONTRACT_FACTORY,
        NFTAddress: KLAYTN_TESTNET_CONTRACT_NFT,
        exchangeTokenAddress: KLAYTN_TESTNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_TESTNET_USDT],
        explorerUrl: KLAYTN_TESTNET_EXPLORER,
    },
    [ChainId.PolygonTestnet] : {
        httpRpcUrl: KLAYTN_MAINNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_MAINNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_MAINNET_CONTRACT_FACTORY,
        NFTAddress: KLAYTN_MAINNET_CONTRACT_NFT,
        exchangeTokenAddress: KLAYTN_MAINNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_MAINNET_USDT],
        explorerUrl: KLAYTN_MAINNET_EXPLORER,
    },
    [ChainId.PolygonMainnet]: {
        httpRpcUrl: KLAYTN_TESTNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_TESTNET_CONTRACT_FACTORY,
        NFTAddress: KLAYTN_TESTNET_CONTRACT_NFT,
        exchangeTokenAddress: KLAYTN_TESTNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_TESTNET_USDT],
        explorerUrl: KLAYTN_TESTNET_EXPLORER,
    },
    [ChainId.BinanceSmartChainTestnet] : {
        httpRpcUrl: KLAYTN_MAINNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_MAINNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_MAINNET_CONTRACT_FACTORY,
        NFTAddress: KLAYTN_MAINNET_CONTRACT_NFT,
        exchangeTokenAddress: KLAYTN_MAINNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_MAINNET_USDT],
        explorerUrl: KLAYTN_MAINNET_EXPLORER,
    },
    [ChainId.BinanceSmartChainMainnet]: {
        httpRpcUrl: KLAYTN_TESTNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_TESTNET_CONTRACT_FACTORY,
        NFTAddress: KLAYTN_TESTNET_CONTRACT_NFT,
        exchangeTokenAddress: KLAYTN_TESTNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_TESTNET_USDT],
        explorerUrl: KLAYTN_TESTNET_EXPLORER,
    },
}

export const GAS_PRICE = Web3.utils.toWei(25, "gwei")
export const GAS_LIMIT = 3000000

