"use client"
import React from "react"
import PoolProviders from "./_hooks/PoolProviders"
import { ContextProps } from "@app/_shared"

const RootLayout = (props: ContextProps) => {
    return <PoolProviders>{props.children}</PoolProviders>
}
export default RootLayout
