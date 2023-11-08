import { createSlice } from "@reduxjs/toolkit"
import Web3, { Address } from "web3"
import { ChainName } from "@config"

export interface BlockchainSlice {
  web3: Web3 | null;
  account: string;
  chainName: ChainName;
  defaultPool: Address
}

const initialState: BlockchainSlice = {
    web3: null,
    account: "",
    chainName: ChainName.KalytnTestnet,
    defaultPool: ""
}

export const blockchainSlice = createSlice({
    name: "blockchain",
    initialState,
    reducers: {
        setWeb3(state, action) {
            state.web3 = action.payload
        },
        setAccount(state, action) {
            state.account = action.payload
        },
        setChainName(state, action) {
            state.chainName = action.payload
        },
        setDefaultPool(state, action){
            state.defaultPool = action.payload
        }
    },
})

export const { setWeb3, setAccount, setChainName, setDefaultPool } = blockchainSlice.actions

export const blockchainReducer = blockchainSlice.reducer
