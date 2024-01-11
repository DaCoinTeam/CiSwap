"use client"
import React from "react"
import { SwapProviders, FormikProviders } from "./_hooks"
import { ProvidersProps } from "@app/_shared"

const RootLayout = (props: ProvidersProps) => {
    return (
        <SwapProviders>
            <FormikProviders>{props.children}</FormikProviders>
        </SwapProviders>
    )
}
export default RootLayout
