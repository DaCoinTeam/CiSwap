import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import React from "react"
import { TitleDisplay, ViewOnExplorer } from "@app/_shared"
import { TransactionHash } from "web3"

export interface ConfigurationSlice {
    darkMode: boolean,

    openWaitSignModal: {
        isShow: boolean,
        title: string
    }
    notify: (txHash: TransactionHash) => void
}

const initialState: ConfigurationSlice = {
    darkMode: false,
    openWaitSignModal: {
        isShow: false,
        title: ""
    },
    notify : (txHash: TransactionHash) => toast(
        <div>
            <TitleDisplay title="Transaction receipt"/>
            <div className="flex gap-1">
                <span className="text-sm">
                View on explorer:
                </span>
                <ViewOnExplorer hexString={txHash} isTransaction showShorten/>
            </div>
        </div>
    )
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
