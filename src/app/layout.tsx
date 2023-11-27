"use client"
import "./globals.css"
import React from "react"
import { ReduxProviders } from "@redux"
import WrappedRootLayout from "./_layout"

const RootLayout = ({
    children,
}: {
  children: React.ReactNode
}) => {
    return (
        <ReduxProviders> 
            <WrappedRootLayout>
                {children}
            </WrappedRootLayout>   
        </ReduxProviders>
    )
}
export default RootLayout
