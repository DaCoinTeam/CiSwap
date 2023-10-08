"use client"
import React from "react"
import {NextUIProvider} from "@nextui-org/react"

export const NextUIProviders = ({children}: { children: React.ReactNode }) =>
    (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )