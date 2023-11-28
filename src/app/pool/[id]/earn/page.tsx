"use client"
import React, { useContext } from "react"
import { LPTokenActions, LPTokenDistributionChart, ProviderList, LPRewards } from "./_components"
import { Spacer } from "@nextui-org/react"
import { BreadcrumbsDisplay } from "@app/_shared"
import { PoolContext } from "../_hooks"

const Page = () => {
    const poolContext = useContext(PoolContext)
    if (poolContext == null) return
    const { poolAddress } = poolContext
    const breadcrumbItems = [
        {
            key: "home",
            url: "/",
            text: "Home",
        }, 
        {
            key: "pool",
            text: poolAddress,
            url: `/pool/${poolAddress}`,
            isAddress: true,
        },
        {
            key: "earn",
            text: "Earn"
        },
    ]
    return (
        <div className="max-w-[1024px] m-auto px-6 py-12">
            <BreadcrumbsDisplay items={breadcrumbItems}/>
            <Spacer y={12}/>
            <div className="grid grid-cols-3 gap-12">
                <LPTokenDistributionChart className="col-span-2" />
                <LPTokenActions className="col-span-1"/>
            </div>

            <Spacer y={12}/>

            <div className="grid grid-cols-3 gap-12">
                <LPRewards className="col-span-2"/>
                <ProviderList className="col-span-1" />
            </div>
        </div>
    )
}

export default Page
