import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

export interface ConfigurationSlice {
    darkMode: boolean,
    notify: () => void
}

const initialState: ConfigurationSlice = {
    darkMode: false,
    notify : () => toast("Wow so easy !")
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

export const { setDarkMode } = configurationSlice.actions

export const configurationReducer = configurationSlice.reducer
