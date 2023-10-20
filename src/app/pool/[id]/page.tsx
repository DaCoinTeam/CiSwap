"use client"
import React, { useContext } from "react"
import { Overview, TokenLockedChart } from "./_components"
import { ViewOnExplorer } from "@app/_shared"
import { PoolAddressContext } from "./layout"

const Page = () => {
    const poolAddress = useContext(PoolAddressContext)
    return (
        <div className="grid grid-cols-3 gap-12">
            <Overview clasName = "col-span-1 mb-7"/>
            <div className="col-span-2">
                <div className="flex flex-col gap-2">
                    <TokenLockedChart/>
                    <ViewOnExplorer className="self-end" hexString={poolAddress}/>
                </div>
            </div>               
        </div>  
    )
}

export default Page