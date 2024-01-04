"use client"
import React from "react"
import { SwapProviders, FormikProviders } from "./_hooks"
import { ContextProps } from "@app/_shared"

const RootLayout = (props: ContextProps) => {
    return (
        <SwapProviders>
            <FormikProviders>{props.children}</FormikProviders>
        </SwapProviders>
    )
}
export default RootLayout
