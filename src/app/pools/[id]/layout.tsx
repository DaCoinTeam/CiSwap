"use client"
import React from "react"
import { ProvidersProps } from "@app/_shared"
import { useParams, usePathname } from "next/navigation"
import { PoolProviders } from "./_hooks"

const RootLayout = (props : ProvidersProps) => {
    const pathname = usePathname()
    const params = useParams()

    return (
        <PoolProviders>
            {props.children}
        </PoolProviders>
    )
}
export default RootLayout
