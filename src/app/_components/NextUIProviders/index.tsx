"use client"
import React from "react"
import {NextUIProvider} from "@nextui-org/react"

const NextUIProviders = ({children}: { children: React.ReactNode }) =>
    (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
export default NextUIProviders