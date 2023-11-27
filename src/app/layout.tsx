"use client"
import "./globals.css"
import React from "react"
import { ReduxProviders } from "@redux"
import WrappedRootLayout from "./_layout"
import { ContextProps } from "./_shared"
import { MetamaskProviders } from "./_hooks"

const RootLayout = (props: ContextProps) => {
    return (
        <ReduxProviders> 
            <MetamaskProviders>
                <WrappedRootLayout>
                    {props.children}
                </WrappedRootLayout>   
            </MetamaskProviders>
        </ReduxProviders>
    )
}
export default RootLayout
