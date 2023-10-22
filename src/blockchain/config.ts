import Web3, { Address } from "web3"

const KLAYTN_MAINNET_CHAIN_ID = 123
const KLAYTN_MAINNET_HTTP_RPC_URL = "..."
const KLAYTN_MAINNET_WEBSOCKET_RPC_URL = "..."
const KLAYTN_MAINNET_CONTRACT_FACTORY = "..."

const KLAYTN_MAINNET_EXCHANGE_TOKEN =
  "0xA6e709154cfc6fBee95C8F2E57a5091C26312753"

const KLAYTN_MAINNET_USDT = "..."
const KLAYTN_MAINNET_EXPLORER = ""


const KLAYTN_TESTNET_CHAIN_ID = 1001
const KLAYTN_TESTNET_HTTP_RPC_URL = "https://api.baobab.klaytn.net:8651"
const KLAYTN_TESTNET_WEBSOCKET_RPC_URL = "wss://public-en-baobab.klaytn.net/ws"
const KLAYTN_TESTNET_CONTRACT_FACTORY =
  "0x8C11912eD15B74CFF42657fAeac48ACd5A4bC048"

const KLAYTN_TESTNET_EXCHANGE_TOKEN =
  "0xA6e709154cfc6fBee95C8F2E57a5091C26312753"

const KLAYTN_TESTNET_USDT =
  "0xEdEb5f63537EbAe7E6dD79D95Cd2EF20C75Cd732"
const KLAYTN_TESTNET_EXPLORER = "https://baobab.klaytnscope.com/"

export const TIME_OUT = 1000

export enum ChainName {
  KlaytnMainnet,
  KalytnTestnet,
  PolygonMainnet,
  PolygonTestnet,
}

export type ChainInfo = {
  chainId: number;
  httpRpcUrl: string;
  websocketRpcUrl: string;
  factoryAddress: Address;
  exchangeTokenAddress: Address;
  stableTokenAddresses: Address[];
  explorerUrl: string;
};

export const chainInfos: Record<number, ChainInfo> = {
    [ChainName.KlaytnMainnet] : {
        chainId: KLAYTN_MAINNET_CHAIN_ID,
        httpRpcUrl: KLAYTN_MAINNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_MAINNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_MAINNET_CONTRACT_FACTORY,
        exchangeTokenAddress: KLAYTN_MAINNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_MAINNET_USDT],
        explorerUrl: KLAYTN_MAINNET_EXPLORER,
    },
    [ChainName.KalytnTestnet]: {
        chainId: KLAYTN_TESTNET_CHAIN_ID,
        httpRpcUrl: KLAYTN_TESTNET_HTTP_RPC_URL,
        websocketRpcUrl: KLAYTN_TESTNET_WEBSOCKET_RPC_URL,
        factoryAddress: KLAYTN_TESTNET_CONTRACT_FACTORY,
        exchangeTokenAddress: KLAYTN_TESTNET_EXCHANGE_TOKEN,
        stableTokenAddresses: [KLAYTN_TESTNET_USDT],
        explorerUrl: KLAYTN_TESTNET_EXPLORER,
    },
}

export const GAS_PRICE = Web3.utils.toWei(25, "gwei")
export const GAS_LIMIT = 3000000

