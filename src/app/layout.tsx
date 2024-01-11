"use client"
import "./globals.css"
import React from "react"
import { ReduxProviders } from "@redux"
import WrappedRootLayout from "./_layout"
import { ProvidersProps } from "./_shared"
import { MetamaskProviders } from "./_hooks"

const RootLayout = (props : ProvidersProps) => {
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
