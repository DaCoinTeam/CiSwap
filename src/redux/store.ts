import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { blockchainReducer, blockchainSlice, configurationReducer, configurationSlice } from "./slices"

const rootReducer =  combineReducers(
    {
        [blockchainSlice.name]: blockchainReducer,
        [configurationSlice.name]: configurationReducer
    }
)
export const store = configureStore({
    reducer: rootReducer 
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store