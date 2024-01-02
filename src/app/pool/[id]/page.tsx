"use client"
import React, { useContext } from "react"
import { Overview, TokenLockedChart, TransactionList } from "./_components"
import { Spacer } from "@nextui-org/react"
import { AppButton, BreadcrumbsDisplay } from "@app/_shared"
import { TokenPairDisplay, TokenPriceRatioDisplay } from "./_components"
import { usePathname, useRouter } from "next/navigation"
import { PoolContext } from "./_hooks"

const Page = () => {
    const poolContext = useContext(PoolContext)
    if (poolContext === null) return
    const { tokenState, poolAddress } = poolContext 
    console.log(tokenState)
    const router = useRouter()
    const path = usePathname()

    const _forwardEarn = () => {
        router.push(`${path}/earn`)
    }
    const _forwardSwap = () => {
        router.push(`${path}/swap`)
    }

    const breadcrumbItems = [
        {
            key: "home",
            url: "/",
            text: "Home",
        }, 
        {
            key: "pool",
            text: poolAddress,
            isAddress: true,
        }
    ]

    return (
        <div className="max-w-[1280px] m-auto px-6 py-12">
            <BreadcrumbsDisplay items={breadcrumbItems}/>
            <Spacer y={12}/>
            <div className="sm:flex justify-between">
                <div>
                    <TokenPairDisplay size="lg" token0ImageUrl={tokenState.token0ImageUrl} token1ImageUrl={tokenState.token1ImageUrl}/>
                    <Spacer y={1}/>
                    <TokenPriceRatioDisplay style="style2"/>
                </div>

                <div className="flex gap-3 mt-4 sm:mt-0">
                    <AppButton bordered text="Earn" onClick={_forwardEarn}/>
                    <AppButton text="Swap" onClick={_forwardSwap}/>
                </div>
            </div>
            <Spacer y={12} />
            <div className="sm:grid grid-cols-3 gap-12">
                <Overview className="col-span-1" />
                <TokenLockedChart className="col-span-2 mt-12 sm:mt-0" />
            </div>
            <Spacer y={12} />
            <TransactionList />
        </div>
    )
}

export default Page
