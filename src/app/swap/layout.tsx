"use client"
import React from "react"
import { SwapProviders } from "./_hooks"
import { ContextProps } from "@app/_shared"

const RootLayout = (props: ContextProps) => {
    return <SwapProviders>{props.children}</SwapProviders>
}
export default RootLayout
