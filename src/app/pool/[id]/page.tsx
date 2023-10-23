"use client"
import React, { useContext } from "react"
import { Overview, TokenLockedChart, TransactionList } from "./_components"
import { Spacer } from "@nextui-org/react"
import { AppButton, TokenPairDisplay, TokenPriceRatioDisplay } from "@app/_shared"
import { usePathname, useRouter } from "next/navigation"
import { TokenStateContext } from "./layout"

const Page = () => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return

    const router = useRouter()
    const path = usePathname()

    const _forwardEarn = () => {
        router.push(`${path}/earn`)
    }
    const _forwardSwap = () => {
        router.push(`${path}/swap`)
    }
    return (
        <>
            <div className="flex justify-between">
                <div>
                    <TokenPairDisplay size="lg"/>
                    <Spacer y={1}/>
                    <TokenPriceRatioDisplay style="style2"/>
                </div>

                <div className="flex gap-3">
                    <AppButton bordered content="Earn" onPress={_forwardEarn}/>
                    <AppButton content="Swap" onPress={_forwardSwap}/>
                </div>
            </div>
            <Spacer y={6} />
            <div className="grid grid-cols-3 gap-12">
                <Overview className="col-span-1" />
                <TokenLockedChart className="col-span-2" />
            </div>
            <Spacer y={12} />
            <TransactionList />
        </>
    )
}

export default Page
