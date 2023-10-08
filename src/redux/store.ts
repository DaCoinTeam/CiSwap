import { configureStore } from "@reduxjs/toolkit"
import { blockchainReducer, blockchainSlice, configurationReducer, configurationSlice } from "./slices"

export const store = configureStore({
    reducer: {
        [blockchainSlice.name]: blockchainReducer,
        [configurationSlice.name]: configurationReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch