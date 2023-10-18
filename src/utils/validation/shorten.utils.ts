import { Address } from "web3"

export const shortenAddress = (account: Address) => `${account.slice(0,4)}...${account.slice(-2)}`