import { createSlice } from "@reduxjs/toolkit"

export interface ConfigurationSlice {
    darkMode: boolean,

    openWaitSignModal: {
        isShow: boolean,
        title: string
    }
}

const initialState: ConfigurationSlice = {
    darkMode: false,
    openWaitSignModal: {
        isShow: false,
        title: ""
    }
}

export const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        setDarkMode(state, action) {
            state.darkMode = action.payload
        },
        setOpenWaitSignModalShow(state, action) {
            state.openWaitSignModal.isShow = action.payload
        },
        setOpenWaitSignModalTitle(state, action) {
            state.openWaitSignModal.title = action.payload
        }
    }
})

export const { setDarkMode, setOpenWaitSignModalShow, setOpenWaitSignModalTitle } = configurationSlice.actions

export const configurationReducer = configurationSlice.reducer
