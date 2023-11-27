import { createSlice } from "@reduxjs/toolkit"
import { Address } from "web3"
import { ChainId, defaultChainId } from "@config"

export interface BlockchainSlice {
  account: string;
  chainId: ChainId;
  defaultPool: Address
}

const initialState: BlockchainSlice = {
    account: "",
    chainId: defaultChainId,
    defaultPool: "",
}

export const blockchainSlice = createSlice({
    name: "blockchain",
    initialState,
    reducers: {
        setAccount(state, action) {
            state.account = action.payload
        },
        setChainId(state, action) {
            state.chainId = action.payload
        },
        setDefaultPool(state, action){
            state.defaultPool = action.payload
        }
    },
})

export const { setAccount, setChainId, setDefaultPool } = blockchainSlice.actions

export const blockchainReducer = blockchainSlice.reducer
