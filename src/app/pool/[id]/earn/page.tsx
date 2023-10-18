"use client"
import React from "react"
import { LPTokenActions, LPTokenDistributionChart } from "./_components"
import { Spacer } from "@nextui-org/react"
import ProviderList from "./_components/ProviderList"

const Page = () => {
    return (
        <>
            <div className="grid grid-cols-3 gap-12">
                <LPTokenDistributionChart className="col-span-2" />
                <LPTokenActions className="col-span-1"/>
            </div>

            <Spacer y={12}/>

            <div className="grid grid-cols-5 gap-12">
                <ProviderList className="col-span-2" />
            </div>
        </>
    )
}

export default Page
