"use client"
import React from "react"
import { SwapProviders } from "./_hooks"
import { ContextProps } from "@app/_shared"
import { FormikProviders } from "./_components"

const RootLayout = (props: ContextProps) => {
    return (
        <SwapProviders>
            <FormikProviders>{props.children}</FormikProviders>
        </SwapProviders>
    )
}
export default RootLayout
