import { createSlice } from "@reduxjs/toolkit"
import { Address } from "web3"
import { ChainId, defaultChainId } from "@config"

export interface BlockchainInfoslice {
  account: string;
  chainId: ChainId;
  defaultPool: Address
}

const initialState: BlockchainInfoslice = {
    account: "",
    chainId: defaultChainId,
    defaultPool: "",
}

export const blockchainInfoslice = createSlice({
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

export const { setAccount, setChainId, setDefaultPool } = blockchainInfoslice.actions

export const blockchainReducer = blockchainInfoslice.reducer
