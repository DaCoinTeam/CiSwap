"use client"
import React, { useContext } from "react"
import { Overview, TokenLockedChart, TransactionList } from "./_components"
import { ViewOnExplorer } from "@app/_shared"
import { PoolAddressContext } from "./layout"
import { Spacer } from "@nextui-org/react"

const Page = () => {
    const poolAddress = useContext(PoolAddressContext)
    return (
        <>
            <div className="grid grid-cols-3 gap-12">
                <Overview className = "col-span-1"/>
                <TokenLockedChart className = "col-span-2"/>
            </div>           
            <Spacer y={12}/>
            <TransactionList />     
        </> 
    )
}

export default Page