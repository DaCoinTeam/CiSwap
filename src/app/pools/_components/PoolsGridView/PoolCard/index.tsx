"use client"
import { PoolSummary } from "../../../_hooks"
import {
    Card,
} from "@nextui-org/react"
import React, { createContext } from "react"
import Header from "./Header"
import Body from "./Body"
import { useRouter, usePathname } from "next/navigation"

interface PoolCardProps {
  summary: PoolSummary;
}

export const PoolCardContext = createContext<PoolSummary|null>(null)

const PoolCard = (props: PoolCardProps) => {
    const router = useRouter()
    const pathname = usePathname()
    
    const onClick = () => router.push(`${pathname}/${props.summary.address}`)

    return (
        <PoolCardContext.Provider value={props.summary}>
            <Card isPressable onClick={onClick} shadow="sm">
                <Header />
                <Body />
            </Card>
        </PoolCardContext.Provider>
    )
}

export default PoolCard
