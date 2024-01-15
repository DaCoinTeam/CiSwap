"use client"
import React from "react"
import { PoolsGridView } from "./_components"
import { BreadcrumbsDisplay } from "@app/_shared"
import { Spacer } from "@nextui-org/react"

export default function Page() {
     
    const breadcrumbItems = [
        {
            key: "home",
            url: "/",
            text: "Home",
        }, 
        {
            key: "pools",
            text: "Pools"
        }
    ]   

    return (
        <div className="max-w-[1280px] m-auto py-12 px-6">
            <BreadcrumbsDisplay items={breadcrumbItems}/>
            <Spacer y={12}/>
            <PoolsGridView />
        </div>
    )
}
