import { createSlice } from "@reduxjs/toolkit"

export interface ConfigurationSlice {
  darkMode: boolean;
}

const initialState: ConfigurationSlice = {
    darkMode: false
}

export const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        setDarkMode(state, action) {
            state.darkMode = action.payload
        },
    },
})

export const {
    setDarkMode,
} = configurationSlice.actions

export const configurationReducer = configurationSlice.reducer
