import React from "react"
import { PriceChart, SwapSection } from "./_components"

const Page = () => {
    return (
        <>
            <div className="flex flex-col-reverse sm:inline sm:grid sm:grid-cols-3 gap-12">
                <PriceChart className = "sm:col-span-2"/>
                <SwapSection className = "sm:col-span-1"/>
            </div>
        </>
    )
}

export default Page