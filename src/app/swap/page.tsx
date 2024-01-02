"use client"
import React from "react"
import { PriceChartSection, SwapSection } from "./_components"
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
        <div className="max-w-[1280px] m-auto px-6 py-12">
            <BreadcrumbsDisplay items={breadcrumbItems}/>
            <Spacer y={12}/>
            <div className="flex flex-col-reverse sm:inline sm:grid sm:grid-cols-7 gap-12">
                <PriceChartSection className="sm:col-span-5" />
                <SwapSection className="sm:col-span-2" />
            </div>
        </div>
    )
}

export default Page
