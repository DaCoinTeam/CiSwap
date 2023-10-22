"use client"
import React from "react"
import { LPTokenActions, LPTokenDistributionChart, ProviderList, LPRewardLogs } from "./_components"
import { Spacer } from "@nextui-org/react"

const Page = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-12">
                <LPTokenDistributionChart className="col-span-2" />
                <LPTokenActions className="col-span-1"/>
            </div>

            <Spacer y={12}/>

            <div className="grid grid-cols-3 gap-12 items-stretch">
                <LPRewardLogs className="col-span-2"/>
                <ProviderList className="col-span-1 min-h-[1000px]" />
            </div>
        </>
    )
}

export default Page
