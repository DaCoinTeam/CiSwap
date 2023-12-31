"use client"
import React from "react"
import { PriceChart, SwapSection } from "./_components"
import { BreadcrumbsDisplay } from "@app/_shared"
import { Spacer } from "@nextui-org/react"

const Page = () => {
    
    const breadcrumbItems = [
        {
            key: "home",
            url: "/",
            text: "Home",
        }, 
        {
            key: "swap",
            text: "Swap"
        }
    ]

    return (
        <div className="max-w-[1024px] m-auto px-6 py-12">
            <BreadcrumbsDisplay items={breadcrumbItems}/>
            <Spacer y={12}/>
            <div className="flex flex-col-reverse sm:inline sm:grid sm:grid-cols-3 gap-12">
                <PriceChart className="sm:col-span-2" />
                <SwapSection className="sm:col-span-1" />
            </div>
        </div>
    )
}

export default Page
