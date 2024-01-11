"use client"
import React from "react"
import { ProvidersProps } from "@app/_shared"
import { PoolsProviders } from "./_hooks"

const RootLayout = (props: ProvidersProps) => {
    return <PoolsProviders>{props.children}</PoolsProviders>
}
export default RootLayout
