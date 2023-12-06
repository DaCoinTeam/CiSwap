"use client"
import React, { useContext } from "react"
import { PriceChart, SwapSection } from "./_components"
import { SwapContext } from "./_hooks"
import { BreadcrumbsDisplay } from "@app/_shared"
import { Spacer } from "@nextui-org/react"

const Page = () => {
    const swapContext = useContext(SwapContext)
    if (swapContext == null) return
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
    console.log(swapContext.swapState)
    return (
        <div className="max-w-[1024px] m-auto px-6 py-12">
            {/* <BreadcrumbsDisplay items={breadcrumbItems}/>
            <Spacer y={12}/>
            <div className="flex flex-col-reverse sm:inline sm:grid sm:grid-cols-3 gap-12">
                <PriceChart className="sm:col-span-2" />
                <SwapSection className="sm:col-span-1" />
            </div> */}
        </div>
    )
}

export default Page
