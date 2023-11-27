import { createSlice } from "@reduxjs/toolkit"
import { Address } from "web3"
import { ChainName } from "@config"

export interface BlockchainSlice {
  account: string;
  chainName: ChainName;
  defaultPool: Address
}

const initialState: BlockchainSlice = {
    account: "",
    chainName: ChainName.KalytnTestnet,
    defaultPool: "",
}

export const blockchainSlice = createSlice({
    name: "blockchain",
    initialState,
    reducers: {
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

export const { setAccount, setChainName, setDefaultPool } = blockchainSlice.actions

export const blockchainReducer = blockchainSlice.reducer
