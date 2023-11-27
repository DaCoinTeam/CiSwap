import { createSlice } from "@reduxjs/toolkit"

export interface ConfigurationSlice {
  darkMode: boolean;

  waitSignModal: {
    isShow: boolean;
    title: string;
  };

  wrongChainMetamaskModal: {
    isShow: boolean;
    chainId: number;
  };
}

const initialState: ConfigurationSlice = {
    darkMode: false,
    waitSignModal: {
        isShow: false,
        title: "",
    },
    wrongChainMetamaskModal: {
        isShow: false,
        chainId: 0,
    },
}

export const configurationSlice = createSlice({
    name: "configuration",
    initialState,
    reducers: {
        setDarkMode(state, action) {
            state.darkMode = action.payload
        },
        setWaitSignModalShow(state, action) {
            state.waitSignModal.isShow = action.payload
        },
        setWaitSignModalTitle(state, action) {
            state.waitSignModal.title = action.payload
        },
        setWrongChainMetamaskModalShow(state, action) {
            state.wrongChainMetamaskModal.isShow = action.payload
        },
        setWrongChainMetamaskModalChainId(state, action) {
            state.wrongChainMetamaskModal.chainId = action.payload
        },
    },
})

export const {
    setDarkMode,
    setWaitSignModalShow,
    setWaitSignModalTitle,
    setWrongChainMetamaskModalShow,
    setWrongChainMetamaskModalChainId,
} = configurationSlice.actions

export const configurationReducer = configurationSlice.reducer
