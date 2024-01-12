import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { blockchainReducer, blockchainInfoslice, modalSlice, modalReducer } from "./slices"

const rootReducer =  combineReducers(
    {
        [blockchainInfoslice.name]: blockchainReducer,
        [modalSlice.name]: modalReducer
    }
)
export const store = configureStore({
    reducer: rootReducer 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store