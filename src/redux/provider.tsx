"use client"
import React, { ReactNode, useRef } from "react"
import { Provider } from "react-redux"
import { AppStore, store } from "./store"

export const ReduxProviders = ({ children }: { children: ReactNode}) => { 
    const storeRef = useRef<AppStore|null>(null)
    if (!storeRef.current) {
        storeRef.current = store
    }
    return (
        <Provider store={storeRef.current}>
            {children}
        </Provider>
    )
}